package com.umc.movie.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class DocumentationTest extends ApiTestSupport {
    @Autowired ObjectMapper mapper;

    @Test
    @DisplayName("문서와 UI는 공개이고 15개 API의 실제 요청 스키마를 생성한다")
    void generatesAllOperations() throws Exception {
        mvc.perform(get("/swagger-ui.html")).andExpect(status().is3xxRedirection());
        mvc.perform(get("/swagger-ui/index.html")).andExpect(status().isOk());
        mvc.perform(get("/v3/api-docs/swagger-config")).andExpect(status().isOk())
                .andExpect(jsonPath("$.url").value("/v3/api-docs"));
        JsonNode document = mapper.readTree(mvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
        var paths = document.path("paths");
        int operations = 0;
        for (JsonNode path : paths) {
            for (String method : new String[]{"get", "post", "patch", "delete"}) {
                if (!path.has(method)) continue;
                operations++;
                assertThat(path.path(method).path("summary").asText()).isNotBlank();
            }
        }
        assertThat(operations).isEqualTo(15);
        assertThat(document.at("/components/schemas/SignUpRequest/properties/email/example").asText())
                .isEqualTo("hash9@example.com");
        assertThat(document.at("/components/securitySchemes/bearerAuth/scheme").asText()).isEqualTo("bearer");
        assertThat(paths.path("/members").path("post").path("security").isMissingNode()
                || paths.path("/members").path("post").path("security").isEmpty()).isTrue();
        assertThat(paths.path("/auth/login").path("post").path("security").isMissingNode()
                || paths.path("/auth/login").path("post").path("security").isEmpty()).isTrue();
        assertThat(paths.path("/members/{memberId}/ratings").path("get").path("security").isMissingNode()
                || paths.path("/members/{memberId}/ratings").path("get").path("security").isEmpty()).isTrue();

        var favorite = paths.path("/favorites").path("post");
        assertThat(favorite.path("security").get(0).has("bearerAuth")).isTrue();
        assertThat(favorite.path("responses").has("201")).isTrue();
        assertThat(favorite.path("responses").path("201").path("content")
                .path("application/json").path("schema").path("$ref").asText()).contains("FavoriteResponse");
        assertThat(favorite.path("parameters").toString()).doesNotContain("memberId");
        assertError(favorite, "409", "FAVORITE409_1");
        assertError(favorite, "401", "AUTH401_2");
        assertError(paths.path("/ratings").path("post"), "409", "RATING409_1");
        assertError(paths.path("/ratings/{ratingId}").path("patch"), "403", "RATING403_1");
        assertError(paths.path("/members/me").path("patch"), "409", "MEMBER409_1");
        assertError(paths.path("/movie-records").path("post"), "409", "FAVORITE409_1");
        assertError(paths.path("/movie-records").path("post"), "409", "RATING409_1");
    }

    private void assertError(JsonNode operation, String status, String code) {
        assertThat(operation.path("responses").path(status).path("content").path("application/json")
                .path("examples").path(code).path("value").path("code").asText()).isEqualTo(code);
    }

    @Test
    @Transactional
    @DisplayName("공개 로그인으로 받은 JWT를 사용해 즐겨찾기 201과 중복 409를 재현한다")
    void signsInAndCallsFavorite() throws Exception {
        var member = member();
        String body = mapper.writeValueAsString(java.util.Map.of(
                "email", member.getEmail(), "password", "Workbook9!Test"));
        String response = mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        String authorization = "Bearer " + mapper.readTree(response).at("/result/accessToken").asText();
        mvc.perform(post("/favorites").header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550}"))
                .andExpect(status().isCreated());
        mvc.perform(post("/favorites").header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
    }
}
