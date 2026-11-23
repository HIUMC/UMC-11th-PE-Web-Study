package com.umc.movie.controller;

import com.umc.movie.config.WebConfig;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.jwt.JwtProvider;
import com.umc.movie.service.FavoriteService;
import com.umc.movie.service.MovieRecordService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {FavoriteController.class, MovieRecordController.class})
@Import({WebConfig.class, AuthInterceptor.class, GlobalExceptionHandler.class})
class FavoriteAndMovieRecordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtProvider jwtProvider;

    @MockitoBean
    private FavoriteService favoriteService;

    @MockitoBean
    private MovieRecordService movieRecordService;

    @Test
    void postFavorites_withoutToken_returns401Auth401_2() throws Exception {
        mockMvc.perform(post("/favorites")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"movieId": 550}
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    void postFavorites_withZeroMovieId_returns400() throws Exception {
        when(jwtProvider.getMemberId("valid-token")).thenReturn(1L);

        mockMvc.perform(post("/favorites")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer valid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"movieId": 0}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4001"));
    }

    @Test
    void favoritesCrudEndpoints_returnCommonApiResponse() throws Exception {
        when(jwtProvider.getMemberId("valid-token")).thenReturn(1L);

        FavoriteResponse created = new FavoriteResponse(1L, 550L, LocalDateTime.of(2026, 9, 6, 21, 0));
        when(favoriteService.create(eq(1L), any())).thenReturn(created);
        when(favoriteService.getMyFavorites(1L)).thenReturn(List.of(created));
        when(favoriteService.getStatus(1L, 550L)).thenReturn(new FavoriteStatusResponse(true));

        mockMvc.perform(post("/favorites")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer valid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"movieId": 550}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.favoriteId").value(1))
                .andExpect(jsonPath("$.result.movieId").value(550));

        mockMvc.perform(get("/favorites")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer valid-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result[0].movieId").value(550));

        mockMvc.perform(get("/favorites/550")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer valid-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result.isFavorite").value(true));

        mockMvc.perform(delete("/favorites/550")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer valid-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result").doesNotExist());
    }

    @Test
    void postMovieRecords_requiresAuthAndReturnsCreatedRecord() throws Exception {
        mockMvc.perform(post("/movie-records")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"movieId": 238, "score": 5, "comment": "좋아요", "addToFavorites": true}
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));

        when(jwtProvider.getMemberId("valid-token")).thenReturn(1L);
        LocalDateTime now = LocalDateTime.of(2026, 9, 6, 21, 10);
        MovieRecordResponse response = new MovieRecordResponse(
                new RatingResponse(3L, 238L, 5, "다시 보고 싶은 영화입니다.", now, now),
                new FavoriteResponse(2L, 238L, now)
        );
        when(movieRecordService.create(eq(1L), any())).thenReturn(response);

        mockMvc.perform(post("/movie-records")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer valid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "movieId": 238,
                                  "score": 5,
                                  "comment": "다시 보고 싶은 영화입니다.",
                                  "addToFavorites": true
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.rating.ratingId").value(3))
                .andExpect(jsonPath("$.result.favorite.favoriteId").value(2));
    }
}
