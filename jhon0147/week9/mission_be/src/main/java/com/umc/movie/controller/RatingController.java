package com.umc.movie.controller;
import com.umc.movie.config.ApiExamples;
import com.umc.movie.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.umc.movie.auth.LoginMember;
import com.umc.movie.dto.*;
import com.umc.movie.service.RatingService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@Tag(name = "평점", description = "평점 등록·수정·삭제와 회원별 공개 목록")
@RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;

    @Operation(summary = "회원별 평점 목록", description = "공개 API. 최신 등록순이며 회원은 있지만 평점이 없으면 빈 배열입니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 조회 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 입력 형식 또는 검증 오류",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "입력 오류", value = ApiExamples.BAD_REQUEST)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "회원 없음", value = ApiExamples.MEMBER_NOT_FOUND)
                        }))
    })
    @GetMapping("/members/{memberId}/ratings")
    public ApiResponse<List<RatingResponse>> getMemberRatings(@Positive @PathVariable Long memberId) {
        return ApiResponse.ok("평점 조회에 성공했습니다.", ratingService.getRatingsByMember(memberId));
    }

    @Operation(summary = "평점 등록", description = "인증 필요. 별점 1~5점, 후기 최대 500자. 회원·영화당 한 번만 등록합니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 등록 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 입력 형식 또는 검증 오류",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "입력 오류", value = ApiExamples.BAD_REQUEST)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "토큰 누락", value = ApiExamples.UNAUTHORIZED),
                                @ExampleObject(name = "잘못된 토큰", value = ApiExamples.INVALID_TOKEN),
                                @ExampleObject(name = "만료", value = ApiExamples.EXPIRED_TOKEN)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "회원 없음", value = ApiExamples.MEMBER_NOT_FOUND)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "RATING409_1 같은 회원·영화 중복",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "평점 중복", value = ApiExamples.RATING_CONFLICT)
                        }))
    })
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @Parameter(hidden = true) @LoginMember Long memberId, @Valid @RequestBody CreateRatingRequest request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.created("평점을 등록했습니다.", ratingService.create(memberId, request)));
    }

    @Operation(summary = "평점 수정", description = "인증 필요. 토큰 회원이 작성한 평점만 수정할 수 있습니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 수정 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 입력 형식 또는 검증 오류",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "입력 오류", value = ApiExamples.BAD_REQUEST)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "토큰 누락", value = ApiExamples.UNAUTHORIZED),
                                @ExampleObject(name = "잘못된 토큰", value = ApiExamples.INVALID_TOKEN),
                                @ExampleObject(name = "만료", value = ApiExamples.EXPIRED_TOKEN)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 다른 회원의 평점",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "수정 권한 없음", value = ApiExamples.RATING_FORBIDDEN)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 평점 없음",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "평점 없음", value = ApiExamples.RATING_NOT_FOUND)
                        }))
    })
    @PatchMapping("/ratings/{ratingId}")
    public ApiResponse<RatingResponse> update(
            @Parameter(hidden = true) @LoginMember Long memberId, @Positive @PathVariable Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request) {
        return ApiResponse.ok("평점을 수정했습니다.", ratingService.update(memberId, ratingId, request));
    }

    @Operation(summary = "평점 삭제", description = "인증 필요. 토큰 회원이 작성한 평점만 삭제할 수 있습니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 삭제 성공, result는 null"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 입력 형식 또는 검증 오류",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "입력 오류", value = ApiExamples.BAD_REQUEST)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "토큰 누락", value = ApiExamples.UNAUTHORIZED),
                                @ExampleObject(name = "잘못된 토큰", value = ApiExamples.INVALID_TOKEN),
                                @ExampleObject(name = "만료", value = ApiExamples.EXPIRED_TOKEN)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 다른 회원의 평점",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "삭제 권한 없음", value = ApiExamples.RATING_FORBIDDEN)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 평점 없음",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "평점 없음", value = ApiExamples.RATING_NOT_FOUND)
                        }))
    })
    @DeleteMapping("/ratings/{ratingId}")
    public ApiResponse<Void> delete(@Parameter(hidden = true) @LoginMember Long memberId, @Positive @PathVariable Long ratingId) {
        ratingService.delete(memberId, ratingId);
        return ApiResponse.ok("평점을 삭제했습니다.", null);
    }
}
