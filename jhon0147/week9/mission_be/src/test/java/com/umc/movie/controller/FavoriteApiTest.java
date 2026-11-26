package com.umc.movie.controller;

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
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FavoriteApiTest {
    @Autowired MockMvc mvc;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @Autowired JwtUtil jwt;
    @MockitoSpyBean FavoriteRepository favorites;
    private Member member;
    private String authorization;

    @BeforeEach
    void setUp() {
        favorites.deleteAll();
        ratings.deleteAll();
        members.deleteAll();
        member = members.save(new Member("favorite-api@umc.com", "unused", "즐겨API"));
        authorization = "Bearer " + jwt.createAccessToken(member.getMemberId(), member.getEmail());
    }

    @Test
    @DisplayName("토큰 없이 즐겨찾기를 등록하면 401과 AUTH401_2를 응답한다")
    void createFavoriteWithoutToken() throws Exception {
        mvc.perform(post("/favorites").contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
        assertThat(favorites.count()).isZero();
    }

    @Test
    @DisplayName("토큰을 담아 즐겨찾기를 등록하면 201과 저장한 영화 ID를 응답한다")
    void createFavorite() throws Exception {
        mvc.perform(post("/favorites").header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550));
        assertThat(favorites.existsByMember_MemberIdAndMovieId(member.getMemberId(), 550L)).isTrue();
    }

    @Test
    @DisplayName("중복 즐겨찾기는 DB 저장을 시도하기 전에 409와 FAVORITE409_1로 거절한다")
    void createFavoriteWhenDuplicated() throws Exception {
        favorites.saveAndFlush(new Favorite(member, 550L));
        clearInvocations(favorites);

        mvc.perform(post("/favorites").header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("FAVORITE409_1"));

        // DB UNIQUE 제약으로도 409가 나오므로 저장 호출 여부까지 확인
        verify(favorites, never()).save(any(Favorite.class));
        assertThat(favorites.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("즐겨찾기하지 않은 영화 조회는 200과 isFavorite false를 응답한다")
    void getFavoriteStatusBeforeRegistration() throws Exception {
        mvc.perform(get("/favorites/550").header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result.isFavorite").value(false));
    }
}
