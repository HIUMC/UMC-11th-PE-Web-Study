// src/main/java/com/umc/movie/controller/RatingController.java
package com.umc.movie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import static com.umc.movie.config.SwaggerConfig.BEARER_AUTH;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Rating")
@RestController
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // 5주차에 만든 유저별 평점 조회입니다. 공개 API라 토큰을 받지 않습니다.
    @Operation(summary = "유저별 평점 목록 조회", description = "공개 API입니다. 토큰이 필요하지 않습니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "평점 배열 반환. 평점이 없으면 빈 배열"),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1: 회원을 찾을 수 없음",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"MEMBER404_1\", \"message\": \"회원을 찾을 수 없음\", \"result\": null}")))
            })
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(@PathVariable Long memberId) {
        return ratingService.getRatingsByMember(memberId);
    }

    // 경로에서 /members/{memberId}가 사라지고 memberId는 인터셉터가 담아둔 값을 씁니다
    @Operation(summary = "영화 평점 등록", description = "Bearer 토큰이 필요합니다. 로그인한 회원 ID는 토큰에서 추출합니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201: 등록한 평점 반환"),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2: 토큰 누락 / AUTH401_3: 유효하지 않은 토큰 / AUTH401_4: 만료된 토큰",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"토큰 누락\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001: 요청 필드 검증 실패",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"COMMON4001\", \"message\": \"요청 필드 검증 실패\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1: 회원을 찾을 수 없음",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"MEMBER404_1\", \"message\": \"회원을 찾을 수 없음\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "RATING409_1: 같은 영화의 평점 중복; COMMON4091: DB 고유 제약 위반",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"RATING409_1\", \"message\": \"같은 영화의 평점 중복\", \"result\": null}")))
            })
    @SecurityRequirement(name = BEARER_AUTH)
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("평점을 등록했습니다.", response));
    }

    // 경로에서도 /{memberId}가 사라지고 인터셉터가 담아둔 값을 씁니다
    @Operation(summary = "내 평점 수정", description = "Bearer 토큰이 필요합니다. 로그인한 회원 ID는 토큰에서 추출합니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 수정한 평점 반환"),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2: 토큰 누락 / AUTH401_3: 유효하지 않은 토큰 / AUTH401_4: 만료된 토큰",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"토큰 누락\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001: 요청 필드 검증 실패",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"COMMON4001\", \"message\": \"요청 필드 검증 실패\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1: 다른 회원의 평점 수정/삭제 불가",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"RATING403_1\", \"message\": \"다른 회원의 평점 수정\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1: 평점을 찾을 수 없음",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"RATING404_1\", \"message\": \"평점을 찾을 수 없음\", \"result\": null}")))
            })
    @SecurityRequirement(name = BEARER_AUTH)
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId,
            @RequestBody @Valid UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.update(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", response));
    }

    @Operation(summary = "내 평점 삭제", description = "Bearer 토큰이 필요합니다. 로그인한 회원 ID는 토큰에서 추출합니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 삭제 성공, result는 null"),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2: 토큰 누락 / AUTH401_3: 유효하지 않은 토큰 / AUTH401_4: 만료된 토큰",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"토큰 누락\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1: 다른 회원의 평점 수정/삭제 불가",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"RATING403_1\", \"message\": \"다른 회원의 평점 수정\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1: 평점을 찾을 수 없음",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"RATING404_1\", \"message\": \"평점을 찾을 수 없음\", \"result\": null}")))
            })
    @SecurityRequirement(name = BEARER_AUTH)
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }
}
