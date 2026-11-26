package com.umc.movie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import java.nio.file.Files;
import java.nio.file.Path;
import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OpenApiTests {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;

    @Test
    @DisplayName("Swagger UI와 JSON은 토큰 없이 열리고 공개/인증 API 및 오류 코드가 문서화된다")
    void documentationMatchesAuthenticationAndErrorContracts() throws Exception {
        mvc.perform(get("/swagger-ui.html")).andExpect(status().is3xxRedirection());
        mvc.perform(get("/swagger-ui/index.html")).andExpect(status().isOk());
        var response = mvc.perform(get("/v3/api-docs")).andExpect(status().isOk()).andReturn().getResponse();
        JsonNode doc = mapper.readTree(response.getContentAsByteArray());
        assertThat(doc.at("/components/securitySchemes/bearerAuth/scheme").asText()).isEqualTo("bearer");
        for (String route : new String[]{"/ratings|post", "/ratings/{ratingId}|patch", "/ratings/{ratingId}|delete",
                "/members/me|get", "/members/me|patch", "/favorites|get", "/favorites|post",
                "/favorites/{movieId}|get", "/favorites/{movieId}|delete", "/movie-records|post"}) {
            JsonNode operation = operation(doc, route);
            assertThat(operation.path("summary").asText()).isNotBlank();
            assertThat(operation.path("security").get(0).has("bearerAuth")).as(route).isTrue();
            assertThat(operation.path("responses").path("401").path("description").asText()).contains("AUTH401_2");
            for (JsonNode parameter : operation.path("parameters")) {
                assertThat(parameter.path("name").asText()).as("Token-derived memberId is not an input").isNotEqualTo("memberId");
            }
        }
        for (String route : new String[]{"/members|post", "/auth/login|post", "/members/{memberId}/ratings|get",
                "/members/email/{email}|get", "/members/nickname/{nickname}|get"}) {
            JsonNode operation = operation(doc, route);
            assertThat(operation.path("summary").asText()).isNotBlank();
            assertThat(operation.path("security").isMissingNode() || operation.path("security").isEmpty()).as(route).isTrue();
        }
        assertThat(operation(doc, "/ratings|post").path("responses").path("409").path("description").asText()).contains("RATING409_1");
        assertThat(operation(doc, "/ratings/{ratingId}|patch").path("responses").path("403").path("description").asText()).contains("RATING403_1");
        assertThat(operation(doc, "/ratings|post").path("summary").asText()).isEqualTo("영화 평점 등록");
        assertThat(operation(doc, "/ratings|post").at("/responses/409/content/application~1json/schema/$ref").asText())
                .isEqualTo("#/components/schemas/ErrorResponse");
        var output = Path.of("build", "week9-evidence");
        Files.createDirectories(output);
        mapper.writerWithDefaultPrettyPrinter().writeValue(output.resolve("openapi.json").toFile(), doc);
    }

    private JsonNode operation(JsonNode document, String route) {
        String[] parts = route.split("\\|");
        return document.path("paths").path(parts[0]).path(parts[1]);
    }
}
