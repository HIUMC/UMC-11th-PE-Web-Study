package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.config.SwaggerExamples;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "평점", description = "영화 평점 등록/수정/삭제/조회 API")
public class RatingController {

    private final RatingService ratingService;

    // 공개 API라 토큰 없이 조회한다 (인터셉터 예외 목록에 등록되어 있다)
    @Operation(
            summary = "유저별 평점 목록 조회",
            description = "특정 회원이 남긴 평점을 최신순으로 조회합니다. 토큰이 필요 없는 공개 API입니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "조회 성공 (공통 응답 포맷 없이 목록이 그대로 내려갑니다)",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            [
                              { "ratingId": 1, "movieId": 550, "score": 5, "comment": "몇 번을 봐도 재밌어요",
                                "createdAt": "2026-09-13T21:00:00", "updatedAt": "2026-09-13T21:00:00" }
                            ]
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "존재하지 않는 회원",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.MEMBER_NOT_FOUND)))
    })
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(
            @Parameter(description = "조회할 회원 ID", example = "1") @PathVariable Long memberId
    ) {
        return ratingService.getRatingsByMember(memberId);
    }

    @Operation(
            summary = "평점 등록",
            description = "토큰의 주인인 회원이 영화 하나에 별점(1~5)과 후기를 남깁니다. 한 영화에 한 번만 등록할 수 있습니다. 토큰이 필요합니다."
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "평점 등록 성공",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": true,
                              "code": "COMMON201",
                              "message": "평점을 등록했습니다.",
                              "result": { "ratingId": 1, "movieId": 550, "score": 5, "comment": "몇 번을 봐도 재밌어요",
                                          "createdAt": "2026-09-13T21:00:00", "updatedAt": "2026-09-13T21:00:00" }
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "입력값 검증 실패",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "COMMON4001",
                              "message": "별점은 5점 이하여야 합니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.UNAUTHORIZED))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "이미 평점을 남긴 영화",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "RATING409_1",
                              "message": "이미 이 영화에 평점을 남기셨습니다.",
                              "result": null
                            }
                            """)))
    })
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("평점을 등록했습니다.", response));
    }

    @Operation(
            summary = "평점 수정",
            description = "내가 남긴 평점의 별점과 후기를 수정합니다. 남이 쓴 평점은 수정할 수 없습니다. 토큰이 필요합니다."
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "수정 성공",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": true,
                              "code": "COMMON200",
                              "message": "평점을 수정했습니다.",
                              "result": { "ratingId": 1, "movieId": 550, "score": 4, "comment": "두 번째 볼 땐 평점이 조금 내려갔어요",
                                          "createdAt": "2026-09-13T21:00:00", "updatedAt": "2026-09-14T09:00:00" }
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "입력값 검증 실패",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "COMMON4001",
                              "message": "별점은 1점 이상이어야 합니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.UNAUTHORIZED))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403", description = "남의 평점을 수정하려 함",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "RATING403_1",
                              "message": "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "존재하지 않는 평점",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "RATING404_1",
                              "message": "해당 평점을 찾을 수 없습니다.",
                              "result": null
                            }
                            """)))
    })
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Parameter(description = "수정할 평점 ID", example = "1") @PathVariable Long ratingId,
            @RequestBody @Valid UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.update(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", response));
    }

    @Operation(
            summary = "평점 삭제",
            description = "내가 남긴 평점을 삭제합니다. 남이 쓴 평점은 삭제할 수 없습니다. 토큰이 필요합니다."
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "삭제 성공",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": true,
                              "code": "COMMON200",
                              "message": "평점을 삭제했습니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.UNAUTHORIZED))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403", description = "남의 평점을 삭제하려 함",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "RATING403_1",
                              "message": "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "존재하지 않는 평점",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "RATING404_1",
                              "message": "해당 평점을 찾을 수 없습니다.",
                              "result": null
                            }
                            """)))
    })
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Parameter(description = "삭제할 평점 ID", example = "1") @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }
}
