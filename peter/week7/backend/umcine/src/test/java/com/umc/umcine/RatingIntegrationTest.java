package com.umc.umcine;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.umcine.entity.Member;
import com.umc.umcine.util.JwtUtil;
import com.umc.umcine.repository.MemberRepository;
import com.umc.umcine.repository.RatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:rating-test;MODE=MySQL;DB_CLOSE_DELAY=-1")
@AutoConfigureMockMvc
class RatingIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MemberRepository memberRepository;
    @MockitoSpyBean
    private RatingRepository ratingRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private String tokenFor(Long memberId) {
        return "Bearer " + jwtUtil.createAccessToken(memberId, "test@example.com");
    }

    private Long ownerId;
    private Long otherId;

    @BeforeEach
    void prepareTestDatabase() {
        ratingRepository.deleteAll();
        memberRepository.deleteAll();
        ownerId = memberRepository.save(new Member("owner@example.com", "test-hash", "owner")).getMemberId();
        otherId = memberRepository.save(new Member("other@example.com", "test-hash", "other")).getMemberId();
    }

    private Long createRating(Long memberId) throws Exception {
        String response = mockMvc.perform(post("/ratings").header("Authorization", tokenFor(memberId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"movieId":550,"score":4,"comment":"좋았어요"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.ratingId").isNumber())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(response).get("result").get("ratingId").asLong();
    }

    @Test
    void createUpdateReadAndDeleteCommitToDatabase() throws Exception {
        Long ratingId = createRating(ownerId);
        assertThat(ratingRepository.findById(ratingId).orElseThrow().getScore()).isEqualTo(4);

        mockMvc.perform(patch("/ratings/{ratingId}", ratingId).header("Authorization", tokenFor(ownerId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"score":5,"comment":"다시 보니 더 좋았어요"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result.score").value(5));

        mockMvc.perform(get("/members/{memberId}/ratings", ownerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].ratingId").value(ratingId))
                .andExpect(jsonPath("$[0].score").value(5))
                .andExpect(jsonPath("$[0].comment").value("다시 보니 더 좋았어요"));
        assertThat(ratingRepository.findById(ratingId).orElseThrow().getScore()).isEqualTo(5);

        mockMvc.perform(delete("/ratings/{ratingId}", ratingId).header("Authorization", tokenFor(ownerId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result").value(nullValue()));
        assertThat(ratingRepository.existsById(ratingId)).isFalse();
        mockMvc.perform(get("/members/{memberId}/ratings", ownerId))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void duplicateRatingReturns409WithoutInserting() throws Exception {
        createRating(ownerId);
        mockMvc.perform(post("/ratings").header("Authorization", tokenFor(ownerId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("RATING409_1"))
                .andExpect(jsonPath("$.message").value("이미 이 영화에 평점을 남기셨습니다."))
                .andExpect(jsonPath("$.result").value(nullValue()));
        assertThat(ratingRepository.count()).isEqualTo(1);
    }

    @Test
    void databaseConstraintPreventsDuplicateEvenWhenPrecheckMissesIt() throws Exception {
        createRating(ownerId);
        doReturn(false).when(ratingRepository).existsByMember_MemberIdAndMovieId(ownerId, 550L);
        mockMvc.perform(post("/ratings").header("Authorization", tokenFor(ownerId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("COMMON4091"))
                .andExpect(jsonPath("$.result").value(nullValue()));
        assertThat(ratingRepository.count()).isEqualTo(1);
    }

    @Test
    void differentMembersCanRateSameMovie() throws Exception {
        createRating(ownerId);
        createRating(otherId);
        assertThat(ratingRepository.count()).isEqualTo(2);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "{}", "{\"movieId\":0,\"score\":4}", "{\"movieId\":-1,\"score\":4}",
            "{\"movieId\":550,\"score\":0}", "{\"movieId\":550,\"score\":6}",
            "{\"movieId\":550}"
    })
    void invalidCreateReturns400WithoutSaving(String body) throws Exception {
        mockMvc.perform(post("/ratings").header("Authorization", tokenFor(ownerId))
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4001"))
                .andExpect(jsonPath("$.result").value(nullValue()));
        assertThat(ratingRepository.count()).isZero();
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "{\"score\":0}", "{\"score\":6}"})
    void invalidUpdateDoesNotChangeStoredRating(String body) throws Exception {
        Long ratingId = createRating(ownerId);
        mockMvc.perform(patch("/ratings/{ratingId}", ratingId).header("Authorization", tokenFor(ownerId))
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("COMMON4001"));
        assertThat(ratingRepository.findById(ratingId).orElseThrow().getScore()).isEqualTo(4);
    }

    @Test
    void longCommentsAreRejectedOnCreateAndUpdate() throws Exception {
        String longComment = "가".repeat(501);
        mockMvc.perform(post("/ratings").header("Authorization", tokenFor(ownerId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "movieId", 550, "score", 4, "comment", longComment))))
                .andExpect(status().isBadRequest());
        assertThat(ratingRepository.count()).isZero();

        Long ratingId = createRating(ownerId);
        mockMvc.perform(patch("/ratings/{ratingId}", ratingId).header("Authorization", tokenFor(ownerId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("score", 5, "comment", longComment))))
                .andExpect(status().isBadRequest());
        assertThat(ratingRepository.findById(ratingId).orElseThrow().getComment()).isEqualTo("좋았어요");
    }

    @ParameterizedTest
    @ValueSource(strings = {"PATCH", "DELETE"})
    void otherMemberCannotModifyOrDeleteRating(String method) throws Exception {
        Long ratingId = createRating(ownerId);
        mockMvc.perform(request(HttpMethod.valueOf(method), "/ratings/{ratingId}", ratingId).header("Authorization", tokenFor(otherId))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"score\":5}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("RATING403_1"))
                .andExpect(jsonPath("$.result").value(nullValue()));
        assertThat(ratingRepository.findById(ratingId).orElseThrow().getScore()).isEqualTo(4);
    }

    @ParameterizedTest
    @ValueSource(strings = {"PATCH", "DELETE"})
    void missingRatingReturns404(String method) throws Exception {
        mockMvc.perform(request(HttpMethod.valueOf(method), "/ratings/{ratingId}", Long.MAX_VALUE).header("Authorization", tokenFor(ownerId))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"score\":5}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("RATING404_1"))
                .andExpect(jsonPath("$.message").value("해당 평점을 찾을 수 없습니다."));
    }

    @Test
    void missingMemberCannotCreateRating() throws Exception {
        mockMvc.perform(post("/ratings").header("Authorization", tokenFor(Long.MAX_VALUE))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":4}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("MEMBER404_1"))
                .andExpect(jsonPath("$.message").value("해당 회원을 찾을 수 없습니다."));
        assertThat(ratingRepository.count()).isZero();
    }
}
