package com.umc.movie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import com.umc.movie.auth.LoginMember;
import com.umc.movie.auth.PublicEndpoint;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.service.RatingService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(produces = "application/json")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PublicEndpoint
    @GetMapping("/members/{memberId}/ratings")
    @Operation(summary = "회원별 평점 조회", description = "공개 API. 지정한 회원의 평점을 최신순으로 반환합니다.")
    public ApiResponse<List<RatingResponse>> getMemberRatings(
            @PathVariable("memberId") @Positive Long memberId
    ) {
        return ApiResponse.ok("평점 조회에 성공했습니다.", ratingService.getRatingsByMember(memberId));
    }

    @PostMapping("/ratings")
    @Operation(summary = "평점 등록", description = "JWT 회원이 영화에 평점을 등록합니다. 중복은 409 RATING409_1입니다.")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @Parameter(hidden = true) @LoginMember Long memberId, @Valid @RequestBody CreateRatingRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("평점을 등록했습니다.", ratingService.create(memberId, request)));
    }

    @PatchMapping("/ratings/{ratingId}")
    @Operation(summary = "평점 수정", description = "본인의 평점만 수정할 수 있습니다. 타인의 평점은 403 RATING403_1입니다.")
    public ApiResponse<RatingResponse> update(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @PathVariable("ratingId") @Positive Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request
    ) {
        return ApiResponse.ok("평점을 수정했습니다.", ratingService.update(memberId, ratingId, request));
    }

    @DeleteMapping("/ratings/{ratingId}")
    @Operation(summary = "평점 삭제", description = "본인의 평점을 삭제합니다. 성공 시 200과 result: null을 반환합니다.")
    public ApiResponse<Void> delete(
            @Parameter(hidden = true) @LoginMember Long memberId, @PathVariable("ratingId") @Positive Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        return ApiResponse.ok("평점을 삭제했습니다.", null);
    }
}
