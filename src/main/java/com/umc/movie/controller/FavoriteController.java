package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "즐겨찾기", description = "로그인한 회원의 영화 즐겨찾기 API")
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
public class FavoriteController {

    private final FavoriteService favoriteService;

    @Operation(
            summary = "즐겨찾기 등록",
            description = "JWT로 식별한 회원의 즐겨찾기에 TMDB 영화 ID를 추가합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "즐겨찾기 등록 성공 (COMMON201)", useReturnTypeSchema = true,
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": true,
                              "code": "COMMON201",
                              "message": "즐겨찾기를 등록했습니다.",
                              "result": {"favoriteId": 1, "movieId": 550, "createdAt": "2026-09-13T21:00:00"}
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "영화 ID 검증 실패 (COMMON4001)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = SwaggerConfig.JWT_UNAUTHORIZED,
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_2",
                              "message": "로그인이 필요한 요청입니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "토큰에 해당하는 회원이 없음 (MEMBER404_1)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "이미 즐겨찾기한 영화 (FAVORITE409_1)",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "FAVORITE409_1",
                              "message": "이미 이 영화를 즐겨찾기하셨습니다.",
                              "result": null
                            }
                            """)))
    })
    @PostMapping("/favorites")
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateFavoriteRequest request
    ) {
        FavoriteResponse response = favoriteService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", response));
    }

    @Operation(summary = "내 즐겨찾기 조회", description = "로그인한 회원의 즐겨찾기를 최신 등록순으로 조회합니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200", description = "즐겨찾기 목록 조회 성공 (COMMON200)", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "401", description = SwaggerConfig.JWT_UNAUTHORIZED,
                            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
            })
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        List<FavoriteResponse> response = favoriteService.getMyFavorites(memberId);
        return ResponseEntity.ok(ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", response));
    }

    @Operation(summary = "즐겨찾기 여부 조회", description = "로그인한 회원이 해당 영화를 즐겨찾기했는지 조회합니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200", description = "즐겨찾기 여부를 true 또는 false로 반환 (COMMON200)",
                            useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "401", description = SwaggerConfig.JWT_UNAUTHORIZED,
                            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
            })
    @GetMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> getStatus(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId
    ) {
        FavoriteStatusResponse response = favoriteService.getStatus(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", response));
    }

    @Operation(summary = "즐겨찾기 해제", description = "로그인한 회원의 즐겨찾기에서 해당 영화를 제거합니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200", description = "즐겨찾기 해제 성공 (COMMON200)", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "401", description = SwaggerConfig.JWT_UNAUTHORIZED,
                            content = @Content(schema = @Schema(implementation = ApiResponse.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "404", description = "등록된 즐겨찾기가 없음 (FAVORITE404_1)",
                            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
            })
    @DeleteMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기를 해제했습니다.", null));
    }
}
