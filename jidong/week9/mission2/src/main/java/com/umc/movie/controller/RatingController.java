package com.umc.movie.controller;

import com.umc.movie.config.ApiExamples;
import com.umc.movie.config.SwaggerConfig;
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
@Tag(name = "평점", description = "영화 평점 등록, 수정, 삭제와 유저별 평점 조회 API")
public class RatingController {

    private final RatingService ratingService;

    @Operation(
            summary = "유저별 평점 조회",
            description = "특정 회원이 남긴 평점을 최신순으로 조회합니다. 누구나 볼 수 있는 목록이라 토큰 없이 호출할 수 있는 공개 API입니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "존재하지 않는 회원",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.MEMBER404_1)))
    })
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(
            @Parameter(description = "평점을 조회할 회원 ID", example = "1") @PathVariable Long memberId
    ) {
        return ratingService.getRatingsByMember(memberId);
    }

    @Operation(
            summary = "평점 등록",
            description = "토큰의 주인인 회원이 영화에 별점과 후기를 남깁니다. 한 영화에는 평점을 한 번만 남길 수 있습니다. 토큰이 필요합니다."
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "평점 등록 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "별점이 1~5가 아니거나 후기가 500자 초과",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.COMMON4001))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.AUTH401_2))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "이미 평점을 남긴 영화",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.RATING409_1)))
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
            description = "토큰의 주인인 회원이 자신이 남긴 평점의 별점과 후기를 수정합니다. 남의 평점은 수정할 수 없습니다. 토큰이 필요합니다."
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "평점 수정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "별점이 1~5가 아니거나 후기가 500자 초과",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.COMMON4001))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.AUTH401_2))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403", description = "다른 회원이 남긴 평점",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.RATING403_1))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "존재하지 않는 평점",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.RATING404_1)))
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
            description = "토큰의 주인인 회원이 자신이 남긴 평점을 삭제합니다. 성공하면 result는 null입니다. 토큰이 필요합니다."
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "평점 삭제 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.AUTH401_2))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403", description = "다른 회원이 남긴 평점",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.RATING403_1))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "존재하지 않는 평점",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = ApiExamples.RATING404_1)))
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
