package com.umc.movie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SwaggerDocumentationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    @Test
    @DisplayName("Swagger UI와 OpenAPI JSON은 토큰 없이 열리며 기존 API 인증은 유지한다")
    void documentationIsPublic() throws Exception {
        mvc.perform(get("/swagger-ui.html")).andExpect(status().is3xxRedirection());
        mvc.perform(get("/swagger-ui/index.html")).andExpect(status().isOk());
        mvc.perform(get("/v3/api-docs/swagger-config")).andExpect(status().isOk());
        mvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.components.securitySchemes.bearerAuth.scheme").value("bearer"));
        mvc.perform(get("/members/me")).andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    @DisplayName("15개 API에 설명이 있고 보호 API 10개에만 자물쇠가 표시된다")
    void operationsMatchAuthenticationRules() throws Exception {
        JsonNode document = document();
        List<String> publicOperations = List.of(
                "post /members", "post /auth/login", "get /members/nickname/{nickname}",
                "get /members/email/{email}", "get /members/{memberId}/ratings");
        List<String> protectedOperations = List.of(
                "get /members/me", "patch /members/me", "post /ratings", "patch /ratings/{ratingId}",
                "delete /ratings/{ratingId}", "post /favorites", "get /favorites",
                "get /favorites/{movieId}", "delete /favorites/{movieId}", "post /movie-records");

        for (String entry : publicOperations) {
            JsonNode operation = operation(document, entry);
            assertThat(operation.path("summary").asText()).as(entry).isNotBlank();
            assertThat(operation.path("security").size()).as(entry).isZero();
        }
        for (String entry : protectedOperations) {
            JsonNode operation = operation(document, entry);
            assertThat(operation.path("summary").asText()).as(entry).isNotBlank();
            assertThat(operation.path("security").toString()).as(entry).contains("bearerAuth");
            assertThat(operation.path("responses").has("401")).as(entry).isTrue();
            for (JsonNode parameter : operation.path("parameters")) {
                assertThat(parameter.path("name").asText()).as(entry).isNotEqualTo("memberId");
            }
        }
        int operationCount = 0;
        for (JsonNode path : document.path("paths")) operationCount += path.size();
        assertThat(operationCount).isEqualTo(15);
    }

    @Test
    @DisplayName("평점과 즐겨찾기의 실패 응답에는 상태 코드와 실제 오류 코드가 함께 표시된다")
    void errorExamplesAndRequestSchemasAreDocumented() throws Exception {
        JsonNode document = document();
        assertThat(operation(document, "post /favorites").path("responses").path("409").toString())
                .contains("FAVORITE409_1");
        assertThat(operation(document, "post /ratings").path("responses").path("409").toString())
                .contains("RATING409_1");
        assertThat(operation(document, "patch /ratings/{ratingId}").path("responses").path("403").toString())
                .contains("RATING403_1");
        assertThat(operation(document, "get /favorites/{movieId}").path("responses").has("404")).isFalse();
        assertThat(operation(document, "delete /ratings/{ratingId}").path("responses").has("200")).isTrue();
        JsonNode favoriteRequest = document.path("components").path("schemas").path("CreateFavoriteRequest");
        assertThat(favoriteRequest.path("properties").has("memberId")).isFalse();
        assertThat(favoriteRequest.path("properties").path("movieId").has("example")).isTrue();
        assertThat(document.path("components").path("schemas").path("SignUpRequest")
                .path("properties").path("password").path("example").asText()).isEqualTo("Umc!1234");
    }

    private JsonNode document() throws Exception {
        return json.readTree(mvc.perform(get("/v3/api-docs")).andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString());
    }

    private JsonNode operation(JsonNode document, String entry) {
        String[] parts = entry.split(" ", 2);
        JsonNode operation = document.path("paths").path(parts[1]).path(parts[0]);
        assertThat(operation.isMissingNode()).as(entry).isFalse();
        return operation;
    }
}
