package com.umc.movie.controller;

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
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PublicEndpoint
    @GetMapping("/members/{memberId}/ratings")
    public ApiResponse<List<RatingResponse>> getMemberRatings(
            @PathVariable("memberId") @Positive Long memberId
    ) {
        return ApiResponse.ok("평점 조회에 성공했습니다.", ratingService.getRatingsByMember(memberId));
    }

    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @LoginMember Long memberId, @Valid @RequestBody CreateRatingRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("평점을 등록했습니다.", ratingService.create(memberId, request)));
    }

    @PatchMapping("/ratings/{ratingId}")
    public ApiResponse<RatingResponse> update(
            @LoginMember Long memberId,
            @PathVariable("ratingId") @Positive Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request
    ) {
        return ApiResponse.ok("평점을 수정했습니다.", ratingService.update(memberId, ratingId, request));
    }

    @DeleteMapping("/ratings/{ratingId}")
    public ApiResponse<Void> delete(
            @LoginMember Long memberId, @PathVariable("ratingId") @Positive Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        return ApiResponse.ok("평점을 삭제했습니다.", null);
    }
}