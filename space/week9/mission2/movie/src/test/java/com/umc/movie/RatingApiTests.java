package com.umc.movie;

import com.umc.movie.entity.Member;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class RatingApiTests {
    @Autowired MockMvc mvc;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @Autowired FavoriteRepository favorites;
    @Autowired JwtUtil jwt;
    Member member;

    @BeforeEach
    void setUp() {
        favorites.deleteAll();
        ratings.deleteAll();
        members.deleteAll();
        member = members.save(Member.builder().email("rating@test.com")
                .nickname("ratingUser").password("unused-test-password").build());
    }

    @Test
    @DisplayName("토큰 없이 POST /ratings 요청 시 401/AUTH401_2이며 DB에 저장되지 않는다")
    void missingTokenReturnsUnauthorizedAndDoesNotSave() throws Exception {
        mvc.perform(post("/ratings").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5,\"comment\":\"great\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
        assertThat(ratings.count()).isZero();
    }

    @Test
    @DisplayName("유효한 토큰으로 POST /ratings 요청 시 201/COMMON201이며 해당 회원의 평점이 저장된다")
    void validTokenReturnsCreatedAndPersistsRating() throws Exception {
        String token = jwt.createAccessToken(member.getMemberId(), member.getEmail());
        mvc.perform(post("/ratings").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5,\"comment\":\"great\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550))
                .andExpect(jsonPath("$.result.score").value(5));
        assertThat(ratings.count()).isEqualTo(1);
        assertThat(ratings.existsByMember_MemberIdAndMovieId(member.getMemberId(), 550L)).isTrue();
    }
}
