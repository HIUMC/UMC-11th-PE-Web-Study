package com.umc.movie.controller;

import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MovieRecordApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    @DisplayName("중복 즐겨찾기로 영화 기록 저장이 409로 실패하면 회원의 평점 개수가 그대로다")
    void rollsBackRatingWhenFavoriteAlreadyExists() throws Exception {
        long movieId = 550L;
        Member member = memberRepository.save(Member.builder()
                .email("movie-record-tester@umc.com")
                .password("test-password")
                .nickname("기록테스터")
                .build());
        Long memberId = member.getMemberId();

        try {
            favoriteRepository.save(Favorite.builder()
                    .member(member)
                    .movieId(movieId)
                    .build());

            int ratingCountBefore = ratingRepository
                    .findByMember_MemberIdOrderByRatingIdDesc(memberId).size();
            String token = jwtUtil.createAccessToken(memberId, member.getEmail());

            mockMvc.perform(post("/movie-records")
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                                    {"movieId":550,"score":5,"comment":"좋았어요","addToFavorites":true}
                                    """))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.code").value("FAVORITE409_1"));

            int ratingCountAfter = ratingRepository
                    .findByMember_MemberIdOrderByRatingIdDesc(memberId).size();
            assertThat(ratingCountAfter)
                    .as("중복 즐겨찾기 요청 후 회원의 평점 개수")
                    .isEqualTo(ratingCountBefore);
        } finally {
            ratingRepository.deleteAll(
                    ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(memberId));
            favoriteRepository.findByMember_MemberIdAndMovieId(memberId, movieId)
                    .ifPresent(favoriteRepository::delete);
            memberRepository.deleteById(memberId);
        }
    }
}