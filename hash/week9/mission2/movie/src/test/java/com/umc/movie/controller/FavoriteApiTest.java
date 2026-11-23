package com.umc.movie.controller;

import com.umc.movie.entity.Favorite;
import com.umc.movie.repository.FavoriteRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
class FavoriteApiTest extends ApiTestSupport {
    @Autowired FavoriteRepository favorites;

    @Test
    @DisplayName("토큰 없이 즐겨찾기 등록 시 401 AUTH401_2를 반환한다")
    void rejectsMissingToken() throws Exception {
        mvc.perform(post("/favorites").contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550}"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    @DisplayName("JWT 즐겨찾기 등록 시 201 COMMON201과 저장된 영화 ID를 반환한다")
    void createsFavorite() throws Exception {
        mvc.perform(post("/favorites").header("Authorization", bearer(member()))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550));
    }

    @Test
    @DisplayName("즐겨찾기 중복 등록 시 409 FAVORITE409_1을 반환한다")
    void rejectsDuplicateFavorite() throws Exception {
        var member = member();
        favorites.saveAndFlush(new Favorite(member, 550L));
        mvc.perform(post("/favorites").header("Authorization", bearer(member))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
    }

    @Test
    @DisplayName("미등록 영화 여부 조회 시 200과 false를 반환한다")
    void reportsMissingFavorite() throws Exception {
        mvc.perform(get("/favorites/550").header("Authorization", bearer(member())))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.isFavorite").value(false));
    }

    @Test
    @DisplayName("다른 회원은 본인의 목록만 조회하고 타인 즐겨찾기를 해제하지 못한다")
    void isolatesMembers() throws Exception {
        var a = member();
        var b = member();
        favorites.saveAndFlush(new Favorite(a, 550L));
        mvc.perform(get("/favorites").header("Authorization", bearer(b)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result").isEmpty());
        mvc.perform(delete("/favorites/550").header("Authorization", bearer(b)))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("FAVORITE404_1"));
        mvc.perform(get("/favorites/550").header("Authorization", bearer(a)))
                .andExpect(jsonPath("$.result.isFavorite").value(true));
    }

    @Test
    @DisplayName("movieId가 0이거나 memberId를 바디에 추가하면 400을 반환한다")
    void validatesBody() throws Exception {
        String token = bearer(member());
        for (String body : new String[]{"{\"movieId\":0}", "{\"movieId\":550,\"memberId\":2}"}) {
            mvc.perform(post("/favorites").header("Authorization", token)
                            .contentType(MediaType.APPLICATION_JSON).content(body))
                    .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("COMMON4001"));
        }
    }
}
