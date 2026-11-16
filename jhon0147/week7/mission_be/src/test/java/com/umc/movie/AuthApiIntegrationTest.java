package com.umc.movie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthApiIntegrationTest {
    private static final String SECRET = "week7-test-key-for-junit-only-minimum-32-bytes";
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired JwtUtil jwt;
    private Member owner;
    private Member other;

    @BeforeEach
    void setUp() {
        ratings.deleteAll();
        members.deleteAll();
        String hash = passwordEncoder.encode("Umc!1234");
        owner = members.save(new Member("a@umc.com", hash, "회원가"));
        other = members.save(new Member("b@umc.com", hash, "회원나"));
    }

    @Test
    void completesWorkbookNineStepScenario() throws Exception {
        String tokenA = login(owner.getEmail());
        String tokenB = login(other.getEmail());
        JsonNode created = body(mvc.perform(auth(post("/ratings"), tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5,\"comment\":\"좋았어요\"}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550))
                .andReturn().getResponse().getContentAsString());
        long id = created.at("/result/ratingId").asLong();
        mvc.perform(auth(post("/ratings"), tokenA).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":4}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RATING409_1"));
        String update = "{\"score\":4,\"comment\":\"다시 보고 수정\"}";
        mvc.perform(auth(patch("/ratings/" + id), tokenA).contentType(MediaType.APPLICATION_JSON).content(update))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.score").value(4));
        mvc.perform(auth(patch("/ratings/" + id), tokenB).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"score\":1}"))
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("RATING403_1"));
        mvc.perform(patch("/ratings/" + id).contentType(MediaType.APPLICATION_JSON).content(update))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
        mvc.perform(auth(delete("/ratings/99999"), tokenA))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("RATING404_1"));
        assertThat(ratings.findById(id).orElseThrow().getScore()).isEqualTo(4);
        mvc.perform(auth(delete("/ratings/" + id), tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result").isEmpty());
        assertThat(ratings.existsById(id)).isFalse();
    }

    @Test
    void loginUsesBcryptAndReturnsNoPassword() throws Exception {
        String token = login(owner.getEmail());
        String payload = new String(Base64.getUrlDecoder().decode(token.split("\\.")[1]), StandardCharsets.UTF_8);
        JsonNode claims = body(payload);
        assertThat(claims.get("sub").asText()).isEqualTo(owner.getMemberId().toString());
        assertThat(claims.get("exp").asLong() - claims.get("iat").asLong()).isEqualTo(3600);
        assertThat(payload).doesNotContain("password", "Umc!1234");
        assertThat(passwordEncoder.matches("Umc!1234", owner.getPassword())).isTrue();
    }

    @Test
    void unknownEmailAndWrongPasswordHaveIdenticalResponses() throws Exception {
        String a = mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"missing@umc.com\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_1"))
                .andReturn().getResponse().getContentAsString();
        String b = mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"a@umc.com\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        assertThat(body(a)).isEqualTo(body(b));
    }

    @Test
    void registrationStillStoresBcryptWithoutReturningHash() throws Exception {
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"new@umc.com\",\"password\":\"Umc!1234\",\"nickname\":\"영화친구\"}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.result.password").doesNotExist());
        String stored = members.findByEmail("new@umc.com").orElseThrow().getPassword();
        assertThat(stored).isNotEqualTo("Umc!1234");
        assertThat(passwordEncoder.matches("Umc!1234", stored)).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "{\"email\":\"wrong\",\"password\":\"x\"}", "{\"email\":\"a@umc.com\",\"password\":\"\"}"})
    void invalidLoginInputIs400(String value) throws Exception {
        mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON).content(value))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("COMMON4001"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"Basic abc", "Bearer ", "bearer"})
    void missingBearerIs401WithMissingCode(String header) throws Exception {
        mvc.perform(get("/members/me").header("Authorization", header))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    void everyPrivateEndpointRequiresToken() throws Exception {
        for (MockHttpServletRequestBuilder request : new MockHttpServletRequestBuilder[]{
                get("/members/me"), patch("/members/me"), post("/ratings"), patch("/ratings/1"), delete("/ratings/1")}) {
            mvc.perform(request.contentType(MediaType.APPLICATION_JSON).content("{}"))
                    .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
        }
    }

    @Test
    void tamperedPayloadFailsSignatureValidation() throws Exception {
        String[] parts = login(owner.getEmail()).split("\\.");
        JsonNode payload = body(new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8));
        ((com.fasterxml.jackson.databind.node.ObjectNode) payload).put("sub", other.getMemberId().toString());
        parts[1] = Base64.getUrlEncoder().withoutPadding().encodeToString(json.writeValueAsBytes(payload));
        mvc.perform(auth(get("/members/me"), String.join(".", parts)))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_3"));
    }

    @Test
    void expiredTokenHasItsOwnCode() throws Exception {
        JwtUtil past = new JwtUtil(SECRET, 60L,
                Clock.fixed(Instant.now().minusSeconds(61), ZoneOffset.UTC));
        String token = past.createAccessToken(owner.getMemberId(), owner.getEmail());
        mvc.perform(auth(get("/members/me"), token))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_4"));
    }

    @Test
    void wrongSigningKeyIsRejected() throws Exception {
        JwtUtil foreign = new JwtUtil("another-test-key-with-at-least-32-bytes-long", 3600L, Clock.systemUTC());
        mvc.perform(auth(get("/members/me"), foreign.createAccessToken(owner.getMemberId(), owner.getEmail())))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_3"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"abc", "0", "-1"})
    void invalidSubjectIs401InsteadOf500(String subject) throws Exception {
        String token = Jwts.builder().subject(subject).expiration(Date.from(Instant.now().plusSeconds(100)))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)), Jwts.SIG.HS256).compact();
        mvc.perform(auth(get("/members/me"), token))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_3"));
    }

    @Test
    void tokenWithoutExpiryIsRejected() throws Exception {
        String token = Jwts.builder().subject(owner.getMemberId().toString())
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)), Jwts.SIG.HS256).compact();
        mvc.perform(auth(get("/members/me"), token))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_3"));
    }

    @Test
    void myInfoUsesTokenAndSameNicknameIsAllowed() throws Exception {
        String token = login(owner.getEmail());
        mvc.perform(auth(get("/members/me?memberId=" + other.getMemberId()), token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.email").value(owner.getEmail()))
                .andExpect(jsonPath("$.result.password").doesNotExist())
                .andExpect(jsonPath("$.result.createdAt").exists());
        mvc.perform(auth(patch("/members/me"), token).contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(java.util.Map.of("nickname", owner.getNickname()))))
                .andExpect(status().isOk());
        mvc.perform(auth(patch("/members/me"), token).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nickname\":\"바꾼닉네임\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.nickname").value("바꾼닉네임"));
        mvc.perform(auth(get("/members/me"), token)).andExpect(status().isOk())
                .andExpect(jsonPath("$.result.nickname").value("바꾼닉네임"));
        assertThat(members.findById(other.getMemberId()).orElseThrow().getNickname()).isEqualTo(other.getNickname());
    }

    @Test
    void duplicateNicknameIs409AndDoesNotOverwrite() throws Exception {
        mvc.perform(auth(patch("/members/me"), login(owner.getEmail())).contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(java.util.Map.of("nickname", other.getNickname()))))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("MEMBER409_1"));
        assertThat(members.findById(owner.getMemberId()).orElseThrow().getNickname()).isEqualTo(owner.getNickname());
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "a", "abcdefghijklm", "   "})
    void nicknameLengthAndBlankValidationRemain400(String nickname) throws Exception {
        mvc.perform(auth(patch("/members/me"), login(owner.getEmail())).contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(java.util.Map.of("nickname", nickname))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void spoofedMemberIdCannotChangeRatingOwner() throws Exception {
        JsonNode response = body(mvc.perform(auth(post("/ratings?memberId=" + other.getMemberId()), login(owner.getEmail()))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":680,\"score\":5,\"memberId\":" + other.getMemberId() + "}"))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString());
        long id = response.at("/result/ratingId").asLong();
        assertThat(ratings.findById(id).orElseThrow().getMember().getMemberId()).isEqualTo(owner.getMemberId());
        mvc.perform(auth(delete("/ratings/" + id), login(other.getEmail())))
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("RATING403_1"));
        assertThat(ratings.existsById(id)).isTrue();
    }

    @Test
    void removedLegacyWriteRouteCannotWriteEvenWithToken() throws Exception {
        mvc.perform(auth(post("/members/" + other.getMemberId() + "/ratings"), login(owner.getEmail()))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550,\"score\":5}"))
                .andExpect(status().isMethodNotAllowed());
        assertThat(ratings.count()).isZero();
    }

    @Test
    void publicQueriesAndCorsPreflightStillWork() throws Exception {
        mvc.perform(get("/members/" + owner.getMemberId() + "/ratings"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result", hasSize(0)));
        mvc.perform(get("/members/email/a@umc.com")).andExpect(status().isOk())
                .andExpect(jsonPath("$.result.available").value(false));
        mvc.perform(options("/ratings").header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "authorization,content-type"))
                .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    private String login(String email) throws Exception {
        String response = mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(java.util.Map.of("email", email, "password", "Umc!1234"))))
                .andExpect(status().isOk()).andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result.password").doesNotExist())
                .andReturn().getResponse().getContentAsString();
        return body(response).at("/result/accessToken").asText();
    }

    private MockHttpServletRequestBuilder auth(MockHttpServletRequestBuilder request, String token) {
        return request.header("Authorization", "Bearer " + token);
    }

    private JsonNode body(String value) throws Exception {
        return json.readTree(value);
    }
}
