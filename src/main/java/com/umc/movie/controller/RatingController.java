// src/main/java/com/umc/movie/controller/RatingController.java
package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "평점", description = "영화 평점 등록, 수정, 삭제 및 회원별 조회 API")
public class RatingController {

    private final RatingService ratingService;

    @Operation(summary = "회원별 평점 조회", description = "토큰 없이 대상 회원이 작성한 평점을 최신순으로 조회합니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200", description = "평점 목록 조회 성공", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "404", description = "존재하지 않는 회원 (MEMBER404_1)",
                            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
            })
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(@PathVariable Long memberId) {
        return ratingService.getRatingsByMember(memberId);
    }

    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @Operation(summary = "평점 등록", description = "로그인한 회원이 영화에 별점과 후기를 남깁니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "201", description = "평점 등록 성공 (COMMON201)", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "400", description = "영화 ID, 별점 또는 후기 검증 실패 (COMMON4001)",
                            content = @Content(schema = @Schema(implementation = ApiResponse.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "401", description = SwaggerConfig.JWT_UNAUTHORIZED,
                            content = @Content(schema = @Schema(implementation = ApiResponse.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "404", description = "토큰에 해당하는 회원이 없음 (MEMBER404_1)",
                            content = @Content(schema = @Schema(implementation = ApiResponse.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "409", description = "같은 영화에 이미 평점을 등록함 (RATING409_1)",
                            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
            })
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("평점을 등록했습니다.", response));
    }

    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @Operation(summary = "평점 수정", description = "로그인한 회원이 직접 작성한 평점의 별점과 후기를 수정합니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200", description = "평점 수정 성공 (COMMON200)", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "400", description = "별점 또는 후기 검증 실패 (COMMON4001)",
                            content = @Content(schema = @Schema(implementation = ApiResponse.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "401", description = SwaggerConfig.JWT_UNAUTHORIZED,
                            content = @Content(schema = @Schema(implementation = ApiResponse.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "403", description = "다른 회원이 작성한 평점 (RATING403_1)",
                            content = @Content(schema = @Schema(implementation = ApiResponse.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "404", description = "존재하지 않는 평점 (RATING404_1)",
                            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
            })
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId,
            @RequestBody @Valid UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.update(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", response));
    }

    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @Operation(summary = "평점 삭제", description = "로그인한 회원이 직접 작성한 평점을 삭제합니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200", description = "평점 삭제 성공 (COMMON200)", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "401", description = SwaggerConfig.JWT_UNAUTHORIZED,
                            content = @Content(schema = @Schema(implementation = ApiResponse.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "403", description = "다른 회원이 작성한 평점 (RATING403_1)",
                            content = @Content(schema = @Schema(implementation = ApiResponse.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "404", description = "존재하지 않는 평점 (RATING404_1)",
                            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
            })
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }
}
