package com.umc.movie.config;

import com.umc.movie.auth.PublicEndpoint;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.exception.ErrorCode;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.examples.Example;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Configuration
public class SwaggerConfig {
    private static final ObjectMapper EXAMPLE_MAPPER = new ObjectMapper();
    public static final String BEARER_AUTH = "bearerAuth";

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info().title("UMCine API").version("week9")
                        .description("공개 API와 JWT 인증 API. 실제 회원·평점·즐겨찾기 요청을 실행할 수 있습니다."))
                .components(new Components().addSecuritySchemes(BEARER_AUTH,
                        new SecurityScheme().type(SecurityScheme.Type.HTTP)
                                .scheme("bearer").bearerFormat("JWT")));
    }

    @Bean
    public OperationCustomizer documentResponses() {
        return (operation, method) -> {
            boolean publicEndpoint = method.hasMethodAnnotation(PublicEndpoint.class);
            operation.setSecurity(publicEndpoint ? new ArrayList<>() :
                    List.of(new SecurityRequirement().addList(BEARER_AUTH)));

            String name = method.getBeanType().getSimpleName() + "." + method.getMethod().getName();
            ApiResponses responses = operation.getResponses();
            if (name.endsWith(".create") || name.equals("MemberController.signUp")) {
                var success = responses.remove("200");
                if (success != null) {
                    success.setDescription("201 Created · COMMON201");
                    responses.addApiResponse("201", success);
                }
            } else if (responses.containsKey("200")) {
                responses.get("200").setDescription("200 OK · COMMON200");
            }

            responses.addApiResponse("400", error("입력 형식 또는 검증 실패",
                    Map.of("COMMON4001", "입력값을 확인해주세요.")));
            if (!publicEndpoint) {
                add(responses, ErrorCode.TOKEN_REQUIRED);
                add(responses, ErrorCode.TOKEN_INVALID);
                add(responses, ErrorCode.TOKEN_EXPIRED);
            }

            switch (name) {
                case "AuthController.login" -> add(responses, ErrorCode.INVALID_CREDENTIALS);
                case "MemberController.signUp" -> {
                    add(responses, ErrorCode.DUPLICATE_EMAIL);
                    add(responses, ErrorCode.DUPLICATE_NICKNAME);
                }
                case "MemberController.getMyInfo" -> add(responses, ErrorCode.MEMBER_NOT_FOUND);
                case "MemberController.updateMyInfo" -> {
                    add(responses, ErrorCode.MEMBER_NOT_FOUND);
                    add(responses, ErrorCode.PROFILE_NICKNAME_CONFLICT);
                }
                case "RatingController.getMemberRatings" -> add(responses, ErrorCode.MEMBER_NOT_FOUND);
                case "RatingController.create" -> {
                    add(responses, ErrorCode.MEMBER_NOT_FOUND);
                    add(responses, ErrorCode.DUPLICATE_RATING);
                }
                case "RatingController.update", "RatingController.delete" -> {
                    add(responses, ErrorCode.RATING_NOT_FOUND);
                    add(responses, ErrorCode.RATING_FORBIDDEN);
                }
                case "FavoriteController.create" -> {
                    add(responses, ErrorCode.MEMBER_NOT_FOUND);
                    add(responses, ErrorCode.DUPLICATE_FAVORITE);
                }
                case "FavoriteController.delete" -> add(responses, ErrorCode.FAVORITE_NOT_FOUND);
                case "MovieRecordController.create" -> {
                    add(responses, ErrorCode.MEMBER_NOT_FOUND);
                    add(responses, ErrorCode.DUPLICATE_RATING);
                    add(responses, ErrorCode.DUPLICATE_FAVORITE);
                }
                default -> { }
            }
            return operation;
        };
    }

    private void add(ApiResponses responses, ErrorCode code) {
        String status = Integer.toString(code.getStatus());
        var response = responses.computeIfAbsent(status, ignored ->
                error("HTTP " + status, Map.of()));
        response.getContent().get("application/json")
                .addExamples(code.getCode(), new Example().value(
                        EXAMPLE_MAPPER.valueToTree(ApiResponse.failure(code.getCode(), code.getMessage()))));
    }

    private io.swagger.v3.oas.models.responses.ApiResponse error(String description, Map<String, String> examples) {
        Schema<?> schema = new Schema<>().type("object")
                .addProperty("isSuccess", new Schema<>().type("boolean"))
                .addProperty("code", new Schema<>().type("string"))
                .addProperty("message", new Schema<>().type("string"))
                .addProperty("result", new Schema<>().nullable(true));
        MediaType media = new MediaType().schema(schema);
        examples.forEach((code, message) -> media.addExamples(code,
                new Example().value(EXAMPLE_MAPPER.valueToTree(ApiResponse.failure(code, message)))));
        return new io.swagger.v3.oas.models.responses.ApiResponse()
                .description(description)
                .content(new Content().addMediaType("application/json", media));
    }
}
