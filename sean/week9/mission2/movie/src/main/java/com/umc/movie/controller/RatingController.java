// src/main/java/com/umc/movie/controller/RatingController.java
package com.umc.movie.controller;

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
import com.umc.movie.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequiredArgsConstructor
@Tag(name = "평점", description = "영화 평점 등록·수정·삭제와 조회 API")
public class RatingController {

    private final RatingService ratingService;

    // 5주차에 만든 유저별 평점 조회입니다. 공개 API라 토큰을 받지 않습니다.

    @Operation(summary = "유저별 평점 조회",
            description = "특정 회원이 남긴 평점 목록을 최신순으로 조회합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.")
    @GetMapping("/members/{memberId}/ratings")
    public ResponseEntity<ApiResponse<List<RatingResponse>>> getMemberRatings(
            @PathVariable Long memberId
    ) {
        List<RatingResponse> response = ratingService.getRatingsByMember(memberId);
        return ResponseEntity.ok(ApiResponse.ok("평점 목록을 조회했습니다.", response));
    }

    // 경로에서 /members/{memberId}가 사라지고 memberId는 인터셉터가 담아둔 값을 씁니다
    @Operation(summary = "평점 등록",
            description = "토큰의 주인인 회원이 영화에 평점을 남깁니다. 같은 영화에 두 번 등록하면 409 RATING409_1이 돌아옵니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("평점을 등록했습니다.", response));
    }

    // 경로에서도 /{memberId}가 사라지고 인터셉터가 담아둔 값을 씁니다
    @Operation(summary = "평점 수정",
            description = "본인이 작성한 평점의 별점과 후기를 수정합니다. 남의 평점이면 403 RATING403_1, 없는 평점이면 404 RATING404_1이 돌아옵니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId,
            @RequestBody @Valid UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.update(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", response));
    }

    @Operation(summary = "평점 삭제",
            description = "본인이 작성한 평점을 삭제합니다. 남의 평점이면 403 RATING403_1, 없는 평점이면 404 RATING404_1이 돌아옵니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }
}