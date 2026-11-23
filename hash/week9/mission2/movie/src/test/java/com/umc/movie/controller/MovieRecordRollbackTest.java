package com.umc.movie.controller;

import com.umc.movie.entity.Favorite;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// 테스트 전체를 @Transactional로 감싸면 Service의 경계가 빠져도 통과할 수 있다.
class MovieRecordRollbackTest extends ApiTestSupport {
    @MockitoSpyBean FavoriteRepository favorites;
    @Autowired RatingRepository ratings;

    @Test
    @DisplayName("이미 즐겨찾기한 영화는 사전 검사에서 거절하고 평점을 저장하지 않는다")
    void rejectsExistingFavoriteBeforeWriting() throws Exception {
        var member = member();
        favorites.saveAndFlush(new Favorite(member, 238L));
        long before = ratings.count();
        mvc.perform(post("/movie-records").header("Authorization", bearer(member))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":238,\"score\":5,\"addToFavorites\":true}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        assertThat(ratings.count()).isEqualTo(before);
        assertThat(ratings.existsByMember_MemberIdAndMovieId(member.getMemberId(), 238L)).isFalse();
    }

    @Test
    @DisplayName("두 번째 INSERT의 DB 중복 오류는 먼저 쓴 평점도 롤백한다")
    void rollsBackFlushedRatingWhenFavoriteInsertFails() throws Exception {
        var member = member();
        favorites.saveAndFlush(new Favorite(member, 680L));
        long before = ratings.count();

        // 사전 조회 뒤 다른 요청이 같은 즐겨찾기를 먼저 넣은 경쟁 상황을 결정적으로 재현한다.
        // 사전 조회만 대체하고 INSERT 및 UNIQUE 검사와 트랜잭션은 실제 H2/JPA로 실행한다.
        doReturn(false).when(favorites)
                .existsByMember_MemberIdAndMovieId(member.getMemberId(), 680L);
        try {
            mvc.perform(post("/movie-records").header("Authorization", bearer(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"movieId\":680,\"score\":5,\"addToFavorites\":true}"))
                    .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));

            assertThat(ratings.count()).isEqualTo(before);
            assertThat(ratings.existsByMember_MemberIdAndMovieId(member.getMemberId(), 680L)).isFalse();
            assertThat(favorites.findByMember_MemberIdAndMovieId(member.getMemberId(), 680L)).isPresent();
        } finally {
            reset(favorites);
        }
    }

    @Test
    @DisplayName("영화 기록은 true일 때 두 데이터를 저장하고 false일 때 평점만 저장한다")
    void savesBothOrOnlyRating() throws Exception {
        var member = member();
        String token = bearer(member);
        mvc.perform(post("/movie-records").header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":13,\"score\":5,\"addToFavorites\":true}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.result.rating.movieId").value(13))
                .andExpect(jsonPath("$.result.favorite.movieId").value(13));
        mvc.perform(post("/movie-records").header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":155,\"score\":4,\"addToFavorites\":false}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.result.favorite").doesNotExist());
        assertThat(ratings.existsByMember_MemberIdAndMovieId(member.getMemberId(), 155L)).isTrue();
        assertThat(favorites.existsByMember_MemberIdAndMovieId(member.getMemberId(), 155L)).isFalse();
    }
}
