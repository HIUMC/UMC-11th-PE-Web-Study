package com.umc.movie.controller;

import com.umc.movie.entity.Rating;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
class RatingApiTest extends ApiTestSupport {
    @Autowired RatingRepository ratings;

    @Test
    @DisplayName("토큰 없이 평점 등록 시 401 AUTH401_2를 반환한다")
    void rejectsMissingToken() throws Exception {
        mvc.perform(post("/ratings").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5,\"comment\":\"후기\"}"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    @DisplayName("JWT 평점 등록 시 201 COMMON201과 저장한 평점을 반환한다")
    void createsRating() throws Exception {
        mvc.perform(post("/ratings").header("Authorization", bearer(member()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5,\"comment\":\"후기\"}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550))
                .andExpect(jsonPath("$.result.score").value(5));
    }

    @Test
    @DisplayName("중복 평점 등록 시 409 RATING409_1을 반환한다")
    void rejectsDuplicateRating() throws Exception {
        var member = member();
        ratings.saveAndFlush(new Rating(member, 550L, 5, "후기"));
        mvc.perform(post("/ratings").header("Authorization", bearer(member))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550,\"score\":4}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RATING409_1"));
    }

    @Test
    @DisplayName("타인 평점 수정 시 403 RATING403_1을 반환한다")
    void rejectsForbiddenUpdate() throws Exception {
        var owner = member();
        var other = member();
        var rating = ratings.saveAndFlush(new Rating(owner, 550L, 5, "원래 후기"));
        mvc.perform(patch("/ratings/" + rating.getRatingId()).header("Authorization", bearer(other))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"score\":1,\"comment\":\"수정 시도\"}"))
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("RATING403_1"));
    }
}
