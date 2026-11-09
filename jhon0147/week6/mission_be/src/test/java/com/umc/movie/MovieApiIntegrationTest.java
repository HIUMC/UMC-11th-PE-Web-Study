package com.umc.movie;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MovieApiIntegrationTest {
    private static final String FIXTURE_HASH = new BCryptPasswordEncoder().encode("Umc!1234");

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @Autowired PasswordEncoder passwordEncoder;

    private Member owner;
    private Member other;

    @BeforeEach
    void setUp() {
        ratings.deleteAll();
        members.deleteAll();
        owner = members.save(new Member("owner@umc.com", FIXTURE_HASH, "수현"));
        other = members.save(new Member("other@umc.com", FIXTURE_HASH, "민서"));
    }

    @Test
    void signsUpWithoutExposingPasswordAndStoresUsableBcryptHash() throws Exception {
        String body = signUp("new@umc.com", "영화친구");
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.email").value("new@umc.com"))
                .andExpect(jsonPath("$.result.password").doesNotExist());

        Member saved = members.findAll().stream().filter(m -> m.getEmail().equals("new@umc.com")).findFirst().orElseThrow();
        assertThat(saved.getPassword()).hasSize(60).isNotEqualTo("Umc!1234");
        assertThat(passwordEncoder.matches("Umc!1234", saved.getPassword())).isTrue();
    }

    @Test
    void duplicateEmailAndNicknameHaveDifferentCodes() throws Exception {
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                        .content(signUp(owner.getEmail(), "새닉네임")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("MEMBER4091"))
                .andExpect(jsonPath("$.isSuccess").value(false));
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                        .content(signUp("unused@umc.com", owner.getNickname())))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("MEMBER4092"));
        assertThat(members.count()).isEqualTo(2);
    }

    static Stream<String> invalidSignUps() {
        return Stream.of(
                "{\"email\":\"wrong\",\"password\":\"Umc!1234\",\"nickname\":\"영화친구\"}",
                "{\"email\":\"new@umc.com\",\"password\":\"umc!1234\",\"nickname\":\"영화친구\"}",
                "{\"email\":\"new@umc.com\",\"password\":\"Umc!1234\",\"nickname\":\"한\"}",
                "{\"email\":\"new@umc.com\",\"password\":\"Umc!1234\",\"nickname\":\"abcdefghijklm\"}",
                "{\"email\":\"new@umc.com\",\"password\":null,\"nickname\":\"영화친구\"}",
                "{\"email\":\"new@umc.com\",\"password\":\"Umc!1234\",\"nickname\":\"   \"}"
        );
    }

    @ParameterizedTest
    @MethodSource("invalidSignUps")
    void rejectsInvalidSignUpBeforeSaving(String body) throws Exception {
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("COMMON4001"))
                .andExpect(jsonPath("$.message").isNotEmpty());
        assertThat(members.count()).isEqualTo(2);
    }

    @Test
    void rejectsPasswordLongerThanBcryptByteLimit() throws Exception {
        String body = json.writeValueAsString(Map.of("email", "long@umc.com", "nickname", "긴비밀번호",
                "password", "Umc!1234" + "가".repeat(24)));
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.message").value(containsString("72바이트")));
        assertThat(members.count()).isEqualTo(2);
    }

    @Test
    void createsUpdatesReadsAndDeletesRatingWithEmpty204Body() throws Exception {
        String created = mvc.perform(post("/members/{id}/ratings", owner.getMemberId())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550,\"score\":5,\"comment\":\"다시 보고 싶은 영화\"}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.code").value("COMMON201"))
                .andReturn().getResponse().getContentAsString();
        long id = json.readTree(created).path("result").asLong();

        mvc.perform(patch("/members/{member}/ratings/{rating}", owner.getMemberId(), id)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"score\":4,\"comment\":\"수정한 후기\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.isSuccess").value(true));
        mvc.perform(get("/members/{id}/ratings", owner.getMemberId()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result", hasSize(1)))
                .andExpect(jsonPath("$.result[0].score").value(4))
                .andExpect(jsonPath("$.result[0].comment").value("수정한 후기"))
                .andExpect(jsonPath("$.result[0].password").doesNotExist());

        mvc.perform(delete("/members/{member}/ratings/{rating}", owner.getMemberId(), id))
                .andExpect(status().isNoContent()).andExpect(content().string(""));
        assertThat(ratings.existsById(id)).isFalse();
        mvc.perform(get("/members/{id}/ratings", owner.getMemberId()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result", hasSize(0)));
    }

    @Test
    void duplicateRatingDoesNotCreateAnotherRow() throws Exception {
        ratings.save(new Rating(owner, 550L, 5, "처음 쓴 후기"));
        mvc.perform(post("/members/{id}/ratings", owner.getMemberId()).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":3}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RATING4091"));
        assertThat(ratings.count()).isEqualTo(1);
    }

    static Stream<String> invalidRatings() {
        return Stream.of("{\"movieId\":550,\"score\":0}", "{\"movieId\":550,\"score\":6}",
                "{\"movieId\":550}", "{\"movieId\":0,\"score\":5}", "{\"score\":5}",
                "{\"movieId\":550.5,\"score\":5}", "{\"movieId\":550,\"score\":\"five\"}",
                "{\"movieId\":550,\"score\":5,\"comment\":\"" + "가".repeat(501) + "\"}");
    }

    @ParameterizedTest
    @MethodSource("invalidRatings")
    void rejectsInvalidRatingWithoutSaving(String body) throws Exception {
        mvc.perform(post("/members/{id}/ratings", owner.getMemberId())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("COMMON4001"));
        assertThat(ratings.count()).isZero();
    }

    @Test
    void rejectsFractionalScore() throws Exception {
        mvc.perform(post("/members/{id}/ratings", owner.getMemberId())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550,\"score\":3.5}"))
                .andExpect(status().isBadRequest());
        assertThat(ratings.count()).isZero();
    }

    @Test
    void commentMayBeOmittedAndLaterCleared() throws Exception {
        Rating rating = ratings.save(new Rating(owner, 550L, 5, "기존 후기"));
        mvc.perform(patch("/members/{member}/ratings/{rating}", owner.getMemberId(), rating.getRatingId())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"score\":1}"))
                .andExpect(status().isOk());
        assertThat(ratings.findById(rating.getRatingId()).orElseThrow().getComment()).isNull();
    }

    @Test
    void anotherMemberCannotModifyOrDeleteRating() throws Exception {
        Rating rating = ratings.save(new Rating(owner, 550L, 5, "원래 후기"));
        mvc.perform(patch("/members/{member}/ratings/{rating}", other.getMemberId(), rating.getRatingId())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"score\":1}"))
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("RATING4031"));
        mvc.perform(delete("/members/{member}/ratings/{rating}", other.getMemberId(), rating.getRatingId()))
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("RATING4031"));
        assertThat(ratings.findById(rating.getRatingId()).orElseThrow().getScore()).isEqualTo(5);
    }

    @Test
    void missingRatingReturns404ForUpdateAndDelete() throws Exception {
        mvc.perform(patch("/members/{member}/ratings/999999", owner.getMemberId())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"score\":4}"))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("RATING4041"));
        mvc.perform(delete("/members/{member}/ratings/999999", owner.getMemberId()))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("RATING4041"));
    }

    @Test
    void missingMemberCannotCreateOrReadRatings() throws Exception {
        mvc.perform(post("/members/999999/ratings").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5}"))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("MEMBER4041"));
        mvc.perform(get("/members/999999/ratings"))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("MEMBER4041"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"abc", "0", "-1"})
    void invalidMemberIdReturnsCommon400(String id) throws Exception {
        mvc.perform(get("/members/{id}/ratings", id))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.isSuccess").value(false));
    }

    @Test
    void malformedAndMissingJsonReturnCommon400() throws Exception {
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON).content("{"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("COMMON4001"));
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("COMMON4001"));
    }

    @Test
    void existingReadApisUseCommonResponse() throws Exception {
        mvc.perform(get("/members/nickname/{nickname}", owner.getNickname()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.available").value(false));
        mvc.perform(get("/members/email/unused@umc.com"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.available").value(true));
    }

    @ParameterizedTest
    @ValueSource(strings = {"POST", "PATCH", "DELETE"})
    void browserPreflightAllowsWriteMethods(String method) throws Exception {
        mvc.perform(options("/members/{id}/ratings", owner.getMemberId())
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", method)
                        .header("Access-Control-Request-Headers", "content-type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().string("Access-Control-Allow-Methods", containsString(method)));
    }

    private String signUp(String email, String nickname) throws Exception {
        return json.writeValueAsString(Map.of("email", email, "password", "Umc!1234", "nickname", nickname));
    }
}
