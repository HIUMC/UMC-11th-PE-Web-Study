package com.umc.umcine;

import com.umc.umcine.entity.Favorite;
import com.umc.umcine.entity.Member;
import com.umc.umcine.repository.FavoriteRepository;
import com.umc.umcine.repository.MemberRepository;
import com.umc.umcine.repository.RatingRepository;
import com.umc.umcine.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:favorite-test;MODE=MySQL;DB_CLOSE_DELAY=-1")
@AutoConfigureMockMvc
class FavoriteIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @MockitoSpyBean FavoriteRepository favorites;
    @Autowired JwtUtil jwt;
    private Long owner;
    private Long other;

    @BeforeEach
    void prepare() {
        favorites.deleteAll();
        ratings.deleteAll();
        members.deleteAll();
        owner = members.save(new Member("owner@example.com", "hash", "owner")).getMemberId();
        other = members.save(new Member("other@example.com", "hash", "other")).getMemberId();
    }

    private MockHttpServletRequestBuilder as(Long memberId, MockHttpServletRequestBuilder request) {
        return request.header("Authorization", "Bearer " + jwt.createAccessToken(memberId, "test@example.com"))
                .contentType(MediaType.APPLICATION_JSON);
    }

    private void add(Long memberId, long movieId) throws Exception {
        mvc.perform(as(memberId, post("/favorites")).content("{\"movieId\":" + movieId + "}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.createdAt").isNotEmpty());
    }

    @Test
    @DisplayName("토큰 없이 즐겨찾기를 등록하면 401과 AUTH401_2를 반환한다")
    void createWithoutTokenReturns401() throws Exception {
        mvc.perform(post("/favorites").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    @DisplayName("토큰으로 즐겨찾기를 등록하면 201과 저장된 영화 ID를 반환한다")
    void createWithTokenReturns201() throws Exception {
        mvc.perform(as(owner, post("/favorites")).content("{\"movieId\":550}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550));
        assertThat(favorites.existsByMember_MemberIdAndMovieId(owner, 550L)).isTrue();
    }

    @Test
    @DisplayName("중복 등록하면 409와 FAVORITE409_1을 반환하고 한 건만 남는다")
    void duplicateFavoriteReturns409() throws Exception {
        add(owner, 550);
        mvc.perform(as(owner, post("/favorites")).content("{\"movieId\":550}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        assertThat(favorites.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("즐겨찾기하지 않은 영화는 200과 isFavorite false를 반환한다")
    void unregisteredMovieReturnsFalse() throws Exception {
        mvc.perform(as(owner, get("/favorites/550")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(false));
    }

    @Test
    @DisplayName("토큰 없이 OpenAPI 문서를 조회할 수 있다")
    void apiDocsIsPublic() throws Exception {
        mvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info.title").value("영화 평점 서비스 API"));
    }

    @Test
    void favoritesLifecycleAndOwnership() throws Exception {
        mvc.perform(as(owner, get("/favorites"))).andExpect(status().isOk())
                .andExpect(jsonPath("$.result").isEmpty());
        mvc.perform(as(owner, get("/favorites/550"))).andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(false));
        add(owner, 550);
        add(owner, 238);
        mvc.perform(as(owner, get("/favorites"))).andExpect(status().isOk())
                .andExpect(jsonPath("$.result.length()").value(2))
                .andExpect(jsonPath("$.result[0].movieId").value(238));
        mvc.perform(as(other, get("/favorites"))).andExpect(status().isOk())
                .andExpect(jsonPath("$.result").isEmpty());
        mvc.perform(as(owner, get("/favorites/550"))).andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(true));
        mvc.perform(as(other, delete("/favorites/550"))).andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("FAVORITE404_1"));
        assertThat(favorites.count()).isEqualTo(2);
        add(other, 550);
        mvc.perform(as(owner, delete("/favorites/550"))).andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(nullValue()));
        mvc.perform(as(owner, get("/favorites/550"))).andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(false));
        assertThat(favorites.existsByMember_MemberIdAndMovieId(other, 550L)).isTrue();
    }

    @Test
    void duplicatePrecheckAndDatabaseConstraint() throws Exception {
        add(owner, 550);
        mvc.perform(as(owner, post("/favorites")).content("{\"movieId\":550}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        doReturn(false).when(favorites).existsByMember_MemberIdAndMovieId(owner, 550L);
        mvc.perform(as(owner, post("/favorites")).content("{\"movieId\":550}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("COMMON4091"));
        assertThat(favorites.count()).isEqualTo(1);
    }

    @ParameterizedTest
    @ValueSource(strings = {"POST /favorites", "GET /favorites", "GET /favorites/550",
            "DELETE /favorites/550", "POST /movie-records"})
    void allNewEndpointsRequireToken(String route) throws Exception {
        String[] parts = route.split(" ");
        mvc.perform(request(HttpMethod.valueOf(parts[0]), parts[1]))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "{\"movieId\":0}", "{\"movieId\":-1}", "{\"movieId\":null}"})
    void invalidFavoriteInputReturns400(String body) throws Exception {
        mvc.perform(as(owner, post("/favorites")).content(body)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("COMMON4001"));
        assertThat(favorites.count()).isZero();
    }

    @Test
    void invalidPathReturns400() throws Exception {
        mvc.perform(as(owner, get("/favorites/0"))).andExpect(status().isBadRequest());
        mvc.perform(as(owner, delete("/favorites/-1"))).andExpect(status().isBadRequest());
        mvc.perform(as(owner, get("/favorites/not-a-number"))).andExpect(status().isBadRequest());
    }

    @Test
    void movieRecordCommitsBothAndRejectsRepeat() throws Exception {
        String body = "{\"movieId\":238,\"score\":5,\"comment\":\"great\",\"addToFavorites\":true}";
        mvc.perform(as(owner, post("/movie-records")).content(body)).andExpect(status().isCreated())
                .andExpect(jsonPath("$.result.rating.movieId").value(238))
                .andExpect(jsonPath("$.result.favorite.movieId").value(238));
        mvc.perform(as(owner, post("/movie-records")).content(body)).andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("RATING409_1"));
        assertThat(ratings.count()).isEqualTo(1);
        assertThat(favorites.count()).isEqualTo(1);
    }

    @Test
    void falseAddsOnlyRatingEvenWithExistingFavorite() throws Exception {
        add(owner, 550);
        mvc.perform(as(owner, post("/movie-records"))
                        .content("{\"movieId\":550,\"score\":4,\"addToFavorites\":false}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.result.favorite").value(nullValue()));
        assertThat(ratings.count()).isEqualTo(1);
        assertThat(favorites.count()).isEqualTo(1);
    }

    @Test
    void favoritePrecheckRejectsRecordWithoutSavingRating() throws Exception {
        add(owner, 550);
        mvc.perform(as(owner, post("/movie-records"))
                        .content("{\"movieId\":550,\"score\":4,\"addToFavorites\":true}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        assertThat(ratings.count()).isZero();
    }

    @Test
    void actualFavoriteUniqueFailureRollsBackAlreadyInsertedRating() throws Exception {
        add(owner, 550);
        doReturn(false).when(favorites).existsByMember_MemberIdAndMovieId(owner, 550L);
        doAnswer(invocation -> {
            // Observe the earlier INSERT inside the transaction, then let H2 reject the duplicate.
            assertThat(ratings.existsByMember_MemberIdAndMovieId(owner, 550L)).isTrue();
            return favorites.saveAndFlush(invocation.getArgument(0));
        }).when(favorites).save(any(Favorite.class));
        mvc.perform(as(owner, post("/movie-records"))
                        .content("{\"movieId\":550,\"score\":5,\"addToFavorites\":true}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("COMMON4091"));
        assertThat(ratings.count()).isZero();
        assertThat(favorites.count()).isEqualTo(1);
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "{\"movieId\":1,\"score\":5}",
            "{\"movieId\":0,\"score\":5,\"addToFavorites\":true}",
            "{\"movieId\":1,\"score\":6,\"addToFavorites\":true}"})
    void invalidRecordSavesNeitherTable(String body) throws Exception {
        mvc.perform(as(owner, post("/movie-records")).content(body)).andExpect(status().isBadRequest());
        assertThat(ratings.count()).isZero();
        assertThat(favorites.count()).isZero();
    }
}
