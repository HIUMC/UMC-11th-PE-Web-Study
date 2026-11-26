package com.umc.movie;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FavoriteApiIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @Autowired FavoriteRepository favorites;
    @Autowired JwtUtil jwt;
    private Member owner;
    private Member other;
    private String tokenA;
    private String tokenB;

    @BeforeEach
    void setUp() {
        favorites.deleteAll();
        ratings.deleteAll();
        members.deleteAll();
        owner = members.save(new Member("favorite-a@umc.com", "unused-in-this-test", "즐겨가"));
        other = members.save(new Member("favorite-b@umc.com", "unused-in-this-test", "즐겨나"));
        tokenA = jwt.createAccessToken(owner.getMemberId(), owner.getEmail());
        tokenB = jwt.createAccessToken(other.getMemberId(), other.getEmail());
    }

    @Test
    void completesFavoriteLifecycleAndSortsNewestFirst() throws Exception {
        mvc.perform(auth(get("/favorites/550"), tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.isFavorite").value(false));
        createFavorite(tokenA, 550);
        mvc.perform(auth(get("/favorites/550"), tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.isFavorite").value(true));
        createFavorite(tokenA, 238);
        mvc.perform(auth(post("/favorites"), tokenA).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        mvc.perform(auth(get("/favorites"), tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result", hasSize(2)))
                .andExpect(jsonPath("$.result[0].movieId").value(238))
                .andExpect(jsonPath("$.result[1].movieId").value(550));
        mvc.perform(auth(delete("/favorites/550"), tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result").isEmpty());
        mvc.perform(auth(get("/favorites/550"), tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.isFavorite").value(false));
        mvc.perform(auth(delete("/favorites/550"), tokenA))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("FAVORITE404_1"));
        assertThat(favorites.count()).isEqualTo(1);
    }

    @Test
    void emptyListAndUnregisteredMovieAreNormalResponses() throws Exception {
        mvc.perform(auth(get("/favorites"), tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result", hasSize(0)));
        mvc.perform(auth(get("/favorites/550"), tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.isFavorite").value(false));
    }

    @Test
    void tokenDeterminesOwnerAndOtherMemberCannotRemoveTheFavorite() throws Exception {
        mvc.perform(auth(post("/favorites?memberId=" + other.getMemberId()), tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"memberId\":" + other.getMemberId() + "}"))
                .andExpect(status().isCreated());
        assertThat(favorites.existsByMember_MemberIdAndMovieId(owner.getMemberId(), 550L)).isTrue();
        assertThat(favorites.existsByMember_MemberIdAndMovieId(other.getMemberId(), 550L)).isFalse();
        mvc.perform(auth(get("/favorites?memberId=" + owner.getMemberId()), tokenB))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result", hasSize(0)));
        mvc.perform(auth(get("/favorites/550"), tokenB))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.isFavorite").value(false));
        mvc.perform(auth(delete("/favorites/550?memberId=" + owner.getMemberId()), tokenB))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("FAVORITE404_1"));
        createFavorite(tokenB, 550);
        mvc.perform(auth(delete("/favorites/550"), tokenB)).andExpect(status().isOk());
        assertThat(favorites.existsByMember_MemberIdAndMovieId(owner.getMemberId(), 550L)).isTrue();
    }

    @Test
    void everyWeekEightEndpointRequiresAuthentication() throws Exception {
        for (MockHttpServletRequestBuilder request : new MockHttpServletRequestBuilder[]{
                post("/favorites"), get("/favorites"), get("/favorites/550"),
                delete("/favorites/550"), post("/movie-records")}) {
            mvc.perform(request.contentType(MediaType.APPLICATION_JSON).content("{}"))
                    .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
        }
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "{\"movieId\":null}", "{\"movieId\":0}",
            "{\"movieId\":-1}", "{\"movieId\":1.5}", "{\"movieId\":\"abc\"}"})
    void invalidFavoriteInputIs400(String body) throws Exception {
        mvc.perform(auth(post("/favorites"), tokenA).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("COMMON4001"));
        assertThat(favorites.count()).isZero();
    }

    @ParameterizedTest
    @ValueSource(strings = {"0", "-1", "abc", "1.5"})
    void invalidMoviePathIs400ForStatusAndDelete(String movieId) throws Exception {
        mvc.perform(auth(get("/favorites/" + movieId), tokenA)).andExpect(status().isBadRequest());
        mvc.perform(auth(delete("/favorites/" + movieId), tokenA)).andExpect(status().isBadRequest());
    }

    @Test
    void movieRecordCommitsBothAndRejectsDuplicateRating() throws Exception {
        String body = "{\"movieId\":238,\"score\":5,\"comment\":\"다시 볼 영화\",\"addToFavorites\":true}";
        mvc.perform(auth(post("/movie-records"), tokenA).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.rating.movieId").value(238))
                .andExpect(jsonPath("$.result.rating.score").value(5))
                .andExpect(jsonPath("$.result.favorite.movieId").value(238))
                .andExpect(jsonPath("$.result.favorite.createdAt").exists());
        mvc.perform(auth(post("/movie-records"), tokenA).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RATING409_1"));
        assertThat(ratings.count()).isEqualTo(1);
        assertThat(favorites.count()).isEqualTo(1);
        assertThat(ratings.findAll().getFirst().getMember().getMemberId()).isEqualTo(owner.getMemberId());
    }

    @Test
    void falseSavesOnlyRatingAndPreservesAnExistingFavorite() throws Exception {
        mvc.perform(auth(post("/movie-records"), tokenA).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":238,\"score\":4,\"addToFavorites\":false}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.result.favorite").isEmpty());
        assertThat(favorites.count()).isZero();

        createFavorite(tokenA, 550);
        mvc.perform(auth(post("/movie-records"), tokenA).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":3,\"addToFavorites\":false}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.result.favorite").isEmpty());
        assertThat(ratings.count()).isEqualTo(2);
        assertThat(favorites.count()).isEqualTo(1);
    }

    @Test
    void duplicateFavoriteIsRejectedBeforeAddingRating() throws Exception {
        createFavorite(tokenA, 550);
        mvc.perform(auth(post("/movie-records"), tokenA).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5,\"addToFavorites\":true}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        assertThat(ratings.count()).isZero();
        assertThat(favorites.count()).isEqualTo(1);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "{\"movieId\":0,\"score\":5,\"addToFavorites\":true}",
            "{\"movieId\":550,\"score\":0,\"addToFavorites\":true}",
            "{\"movieId\":550,\"score\":6,\"addToFavorites\":true}",
            "{\"movieId\":550,\"score\":1.5,\"addToFavorites\":true}",
            "{\"movieId\":550,\"addToFavorites\":true}",
            "{\"movieId\":550,\"score\":5}",
            "{\"movieId\":550,\"score\":5,\"addToFavorites\":null}"
    })
    void invalidMovieRecordIs400WithoutAnyWrites(String body) throws Exception {
        mvc.perform(auth(post("/movie-records"), tokenA).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("COMMON4001"));
        assertThat(ratings.count()).isZero();
        assertThat(favorites.count()).isZero();
    }

    @Test
    void longCommentUsesTheSameLimitAsTheRatingApi() throws Exception {
        String body = json.writeValueAsString(java.util.Map.of(
                "movieId", 550, "score", 5, "comment", "가".repeat(501), "addToFavorites", true));
        mvc.perform(auth(post("/movie-records"), tokenA).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
        assertThat(ratings.count()).isZero();
    }

    @Test
    void movieRecordIgnoresSpoofedMemberId() throws Exception {
        mvc.perform(auth(post("/movie-records?memberId=" + other.getMemberId()), tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5,\"addToFavorites\":true,\"memberId\":"
                                + other.getMemberId() + "}"))
                .andExpect(status().isCreated());
        assertThat(ratings.existsByMember_MemberIdAndMovieId(owner.getMemberId(), 550L)).isTrue();
        assertThat(ratings.existsByMember_MemberIdAndMovieId(other.getMemberId(), 550L)).isFalse();
        assertThat(favorites.existsByMember_MemberIdAndMovieId(owner.getMemberId(), 550L)).isTrue();
    }

    @Test
    void writeForMemberMissingFromDatabaseIs404() throws Exception {
        String missing = jwt.createAccessToken(999999L, "removed@umc.com");
        mvc.perform(auth(post("/favorites"), missing).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550}"))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("MEMBER404_1"));
        mvc.perform(auth(post("/movie-records"), missing).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5,\"addToFavorites\":true}"))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("MEMBER404_1"));
    }

    private void createFavorite(String token, long movieId) throws Exception {
        mvc.perform(auth(post("/favorites"), token).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":" + movieId + "}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.favoriteId").isNumber())
                .andExpect(jsonPath("$.result.createdAt").exists());
    }

    private MockHttpServletRequestBuilder auth(MockHttpServletRequestBuilder request, String token) {
        return request.header("Authorization", "Bearer " + token);
    }
}
