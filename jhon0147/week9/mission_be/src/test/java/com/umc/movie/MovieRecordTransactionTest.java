package com.umc.movie;

import com.umc.movie.entity.Favorite;
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
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MovieRecordTransactionTest {
    @Autowired MockMvc mvc;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @Autowired JwtUtil jwt;
    @MockitoSpyBean FavoriteRepository favorites;
    private Member owner;

    @BeforeEach
    void setUp() {
        favorites.deleteAll();
        ratings.deleteAll();
        members.deleteAll();
        owner = members.save(new Member("transaction@umc.com", "unused-in-this-test", "묶음저장"));
    }

    @Test
    @DisplayName("서비스 사전 검사 없이도 DB UNIQUE 제약이 중복 즐겨찾기를 차단한다")
    void databaseUniqueConstraintWorksWithoutServicePrecheck() {
        favorites.saveAndFlush(new Favorite(owner, 550L));
        assertThatThrownBy(() -> favorites.saveAndFlush(new Favorite(owner, 550L)))
                .isInstanceOf(DataIntegrityViolationException.class);
        assertThat(favorites.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("즐겨찾기 저장이 실패하면 앞서 INSERT한 평점도 rollback되어 남지 않는다")
    void favoriteConstraintFailureRollsBackTheEarlierRatingInsert() throws Exception {
        Favorite existing = favorites.saveAndFlush(new Favorite(owner, 550L));
        long ratingCountBefore = ratings.count();
        // 사전 검사 직후 다른 요청이 먼저 저장한 상황을 재현
        doReturn(false).when(favorites).existsByMember_MemberIdAndMovieId(owner.getMemberId(), 550L);
        String token = jwt.createAccessToken(owner.getMemberId(), owner.getEmail());

        mvc.perform(post("/movie-records").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5,\"addToFavorites\":true}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));

        // 테스트 자체에 @Transactional을 붙이지 않고 요청이 끝난 뒤 DB를 조회
        assertThat(ratings.count()).isEqualTo(ratingCountBefore);
        assertThat(ratings.existsByMember_MemberIdAndMovieId(owner.getMemberId(), 550L)).isFalse();
        assertThat(favorites.count()).isEqualTo(1);
        assertThat(favorites.existsById(existing.getFavoriteId())).isTrue();
    }
}
