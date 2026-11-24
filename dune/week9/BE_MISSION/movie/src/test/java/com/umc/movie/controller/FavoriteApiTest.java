package com.umc.movie.controller;

import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class FavoriteApiTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private Member member;
    private String authorization;

    @BeforeEach
    void setUp() {
        member = memberRepository.save(Member.builder()
                .email("challenger@umc.com")
                .password("test-user-password-hash")
                .nickname("영화조아")
                .build());
        authorization = "Bearer " + jwtUtil.createAccessToken(member.getMemberId());
    }

    @Test
    void requiresTokenToCreateFavorite() throws Exception {
        mockMvc.perform(createFavoriteRequest())
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    void createsFavoriteWithToken() throws Exception {
        mockMvc.perform(createFavoriteRequest().header(HttpHeaders.AUTHORIZATION, authorization))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.favoriteId").isNumber())
                .andExpect(jsonPath("$.result.movieId").value(550));

        assertThat(favoriteRepository.existsByMember_MemberIdAndMovieId(member.getMemberId(), 550L)).isTrue();
    }

    @Test
    void rejectsDuplicateFavorite() throws Exception {
        favoriteRepository.save(Favorite.builder().member(member).movieId(550L).build());

        mockMvc.perform(createFavoriteRequest().header(HttpHeaders.AUTHORIZATION, authorization))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("FAVORITE409_1"));
    }

    @Test
    void reportsFalseForMovieOutsideFavorites() throws Exception {
        mockMvc.perform(get("/favorites/550").header(HttpHeaders.AUTHORIZATION, authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(false));
    }

    private MockHttpServletRequestBuilder createFavoriteRequest() {
        return post("/favorites").contentType(MediaType.APPLICATION_JSON).content("""
                {"movieId":550}
                """);
    }
}
