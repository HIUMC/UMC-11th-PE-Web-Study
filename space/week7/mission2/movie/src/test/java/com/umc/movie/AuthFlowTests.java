package com.umc.movie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthFlowTests {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;

    @BeforeEach
    void resetDatabase() {
        ratings.deleteAll();
        members.deleteAll();
    }

    private ResultActions json(MockHttpServletRequestBuilder request, String body) throws Exception {
        return mvc.perform(request.contentType(MediaType.APPLICATION_JSON).content(body));
    }

    private JsonNode body(ResultActions response) throws Exception {
        return mapper.readTree(response.andReturn().getResponse().getContentAsString());
    }

    private long signUp(String email, String nickname) throws Exception {
        return body(json(post("/members"), """
                {"email":"%s","nickname":"%s","password":"Password1!"}
                """.formatted(email, nickname)).andExpect(status().isCreated()))
                .path("result").path("memberId").asLong();
    }

    private String login(String email) throws Exception {
        return body(json(post("/auth/login"), """
                {"email":"%s","password":"Password1!"}
                """.formatted(email)).andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200")))
                .path("result").path("accessToken").asText();
    }

    @Test
    void ratingScenarioChecksAuthenticationOwnershipAndDuplicates() throws Exception {
        long memberA = signUp("a@umc.com", "memberA");
        signUp("b@umc.com", "memberB");
        String tokenA = "Bearer " + login("a@umc.com");
        String tokenB = "Bearer " + login("b@umc.com");
        String createBody = """
                {"movieId":100,"score":5,"comment":"great"}
                """;
        long ratingId = body(json(post("/ratings").header("Authorization", tokenA), createBody)
                .andExpect(status().isCreated()).andExpect(jsonPath("$.code").value("COMMON201")))
                .path("result").path("ratingId").asLong();
        json(post("/ratings").header("Authorization", tokenA), createBody)
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RATING409_1"));
        json(patch("/ratings/{id}", ratingId).header("Authorization", tokenA), "{\"score\":4}")
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.score").value(4));
        json(patch("/ratings/{id}", ratingId).header("Authorization", tokenB), "{\"score\":1}")
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("RATING403_1"));
        mvc.perform(delete("/ratings/{id}", ratingId).header("Authorization", tokenB))
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("RATING403_1"));
        json(patch("/ratings/{id}", ratingId), "{\"score\":1}")
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
        mvc.perform(delete("/ratings/999999").header("Authorization", tokenA))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("RATING404_1"));
        mvc.perform(get("/members/{id}/ratings", memberA))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].score").value(4));
        mvc.perform(delete("/ratings/{id}", ratingId).header("Authorization", tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(content().json("{\"result\":null}"));
        assertThat(ratings.existsById(ratingId)).isFalse();
    }

    @Test
    void myInfoChangesPersistAndRejectDuplicateNicknames() throws Exception {
        signUp("a@umc.com", "memberA");
        signUp("b@umc.com", "memberB");
        String token = "Bearer " + login("a@umc.com");
        mvc.perform(get("/members/me").header("Authorization", token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.email").value("a@umc.com"))
                .andExpect(jsonPath("$.result.createdAt").exists())
                .andExpect(jsonPath("$.result.password").doesNotExist());
        json(patch("/members/me").header("Authorization", token), "{\"nickname\":\"memberA\"}")
                .andExpect(status().isOk());
        json(patch("/members/me").header("Authorization", token), "{\"nickname\":\"memberB\"}")
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("MEMBER409_1"));
        json(patch("/members/me").header("Authorization", token), "{\"nickname\":\"newName\"}")
                .andExpect(status().isOk());
        mvc.perform(get("/members/me").header("Authorization", token))
                .andExpect(jsonPath("$.result.nickname").value("newName"));
        json(patch("/members/me").header("Authorization", token), "{\"nickname\":\"x\"}")
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("COMMON4001"));
    }

    @Test
    void wrongEmailAndPasswordReturnTheSameFailure() throws Exception {
        signUp("a@umc.com", "memberA");
        JsonNode unknown = body(json(post("/auth/login"), "{\"email\":\"unknown@umc.com\",\"password\":\"wrong\"}")
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_1")));
        JsonNode wrong = body(json(post("/auth/login"), "{\"email\":\"a@umc.com\",\"password\":\"wrong\"}")
                .andExpect(status().isUnauthorized()));
        assertThat(wrong).isEqualTo(unknown);
        json(post("/auth/login"), "{\"email\":\"invalid\",\"password\":\"\"}")
                .andExpect(status().isBadRequest());
    }

    @Test
    void missingMalformedForgedAndExpiredTokensAreRejected() throws Exception {
        long memberId = signUp("a@umc.com", "memberA");
        mvc.perform(get("/members/me")).andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
        for (String token : new String[]{"bad-token", "", new JwtUtil(
                "different-signing-key-at-least-32-bytes-long", 3600L)
                .createAccessToken(memberId, "a@umc.com")}) {
            mvc.perform(get("/members/me").header("Authorization", "Bearer " + token))
                    .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_3"));
        }
        // The workbook allows 60 seconds of clock skew, so expire beyond that allowance.
        String expired = new JwtUtil("test-only-movie-jwt-secret-at-least-32-bytes", -120L)
                .createAccessToken(memberId, "a@umc.com");
        mvc.perform(get("/members/me").header("Authorization", "Bearer " + expired))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_4"));
    }

    @Test
    void publicChecksAndCorsPreflightWorkWithoutToken() throws Exception {
        mvc.perform(get("/members/email/test@umc.com")).andExpect(status().isOk());
        mvc.perform(get("/members/nickname/test")).andExpect(status().isOk());
        mvc.perform(options("/ratings").header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "authorization,content-type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
        json(post("/ratings"), "{\"movieId\":100,\"score\":5}")
                .andExpect(status().isUnauthorized());
    }
}
