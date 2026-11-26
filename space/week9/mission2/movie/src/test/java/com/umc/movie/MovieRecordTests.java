package com.umc.movie;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.entity.Favorite;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.service.MovieRecordService;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class MovieRecordTests {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @MockitoSpyBean FavoriteRepository favorites;
    @Autowired MovieRecordService service;
    @Autowired JwtUtil jwt;
    long memberId;
    String token;

    @BeforeEach
    void setup() throws Exception {
        favorites.deleteAll(); ratings.deleteAll(); members.deleteAll();
        var response = mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"record@test.com\",\"nickname\":\"recordUser\",\"password\":\"Password1!\"}"))
                .andExpect(status().isCreated()).andReturn().getResponse();
        memberId = mapper.readTree(response.getContentAsString()).path("result").path("memberId").asLong();
        token = "Bearer " + jwt.createAccessToken(memberId, "record@test.com");
    }

    private void evidence(String name, String method, String url, String body, int expected) throws Exception {
        var request = switch (method) {
            case "POST" -> post(url);
            case "DELETE" -> delete(url);
            default -> get(url);
        };
        var response = mvc.perform(request.header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().is(expected)).andReturn().getResponse();
        var data = new LinkedHashMap<String, Object>();
        data.put("source", "Spring MockMvc + H2 integration test (not Postman)");
        data.put("method", method); data.put("url", url);
        data.put("authorization", "Bearer <redacted>");
        data.put("request", body.isEmpty() ? null : mapper.readTree(body));
        data.put("status", response.getStatus());
        data.put("response", mapper.readTree(response.getContentAsString()));
        var dir = Path.of("build", "mission-evidence"); Files.createDirectories(dir);
        mapper.writerWithDefaultPrettyPrinter().writeValue(dir.resolve(name + ".json").toFile(), data);
    }

    @Test
    void successfulApiResponsesAndDuplicateEvidence() throws Exception {
        evidence("01-favorite-before", "GET", "/favorites/550", "", 200);
        evidence("02-favorite-create", "POST", "/favorites", "{\"movieId\":550}", 201);
        evidence("03-favorite-duplicate", "POST", "/favorites", "{\"movieId\":550}", 409);
        evidence("04-favorite-list", "GET", "/favorites", "", 200);
        evidence("05-favorite-status", "GET", "/favorites/550", "", 200);
        evidence("06-favorite-delete", "DELETE", "/favorites/550", "", 200);
        evidence("07-favorite-empty", "GET", "/favorites", "", 200);
        evidence("08-movie-record", "POST", "/movie-records",
                "{\"movieId\":238,\"score\":5,\"comment\":\"다시 보고 싶은 영화\",\"addToFavorites\":true}", 201);
        assertThat(ratings.count()).isEqualTo(1);
        assertThat(favorites.count()).isEqualTo(1);
        evidence("09-record-duplicate", "POST", "/movie-records",
                "{\"movieId\":238,\"score\":5,\"addToFavorites\":true}", 409);
        assertThat(ratings.count()).isEqualTo(1);
        assertThat(favorites.count()).isEqualTo(1);
    }

    @Test
    void falseSavesOnlyRatingAndExistingFavoritePreventsNewRating() throws Exception {
        mvc.perform(post("/movie-records").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":100,\"score\":4,\"addToFavorites\":false}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.result.rating.score").value(4))
                .andExpect(content().json("{\"result\":{\"favorite\":null}}"));
        assertThat(favorites.count()).isZero();
        mvc.perform(post("/favorites").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":200}")).andExpect(status().isCreated());
        mvc.perform(post("/movie-records").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":200,\"score\":4,\"addToFavorites\":true}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        assertThat(ratings.existsByMember_MemberIdAndMovieId(memberId, 200L)).isFalse();
    }

    @Test
    void failureAfterRatingInsertRollsBackTheRating() {
        // The rating has actually been flushed before the second write fails.
        doAnswer(invocation -> {
            assertThat(ratings.existsByMember_MemberIdAndMovieId(memberId, 300L)).isTrue();
            throw new DataIntegrityViolationException("Simulated second-write failure");
        }).when(favorites).saveAndFlush(any(Favorite.class));
        assertThatThrownBy(() -> service.create(memberId, new CreateMovieRecordRequest(300L, 5, null, true)))
                .isInstanceOf(DataIntegrityViolationException.class);
        // No test-level transaction: this reads after the service proxy rolled back.
        assertThat(ratings.existsByMember_MemberIdAndMovieId(memberId, 300L)).isFalse();
        assertThat(favorites.count()).isZero();
    }

    @Test
    void authenticationAndRequiredInputs() throws Exception {
        mvc.perform(post("/movie-records").contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":1,\"score\":5,\"addToFavorites\":true}"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
        for (String body : new String[]{"{}", "{\"movieId\":0,\"score\":5,\"addToFavorites\":true}",
                "{\"movieId\":1,\"score\":6,\"addToFavorites\":true}", "{\"movieId\":1,\"score\":5}"}) {
            mvc.perform(post("/movie-records").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                    .content(body)).andExpect(status().isBadRequest());
        }
        assertThat(ratings.count()).isZero(); assertThat(favorites.count()).isZero();
    }

    @Test
    void favoritesAreNewestFirst() throws Exception {
        for (int id : new int[]{100,200}) {
            mvc.perform(post("/favorites").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                    .content("{\"movieId\":" + id + "}")).andExpect(status().isCreated());
        }
        mvc.perform(get("/favorites").header("Authorization", token))
                .andExpect(jsonPath("$.result[0].movieId").value(200))
                .andExpect(jsonPath("$.result[1].movieId").value(100));
    }
}
