package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.service.RatingService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class RatingController {
    private final RatingService ratingService;

    @GetMapping("/{memberId}/ratings")
    public ApiResponse<List<RatingResponse>> getMemberRatings(
            @PathVariable("memberId") @Positive Long memberId
    ) {
        return ApiResponse.ok(
                "평점 조회에 성공했습니다.",
                ratingService.getRatingsByMember(memberId)
        );
    }

    @PostMapping("/{memberId}/ratings")
    public ResponseEntity<ApiResponse<Long>> create(
            @PathVariable("memberId") @Positive Long memberId,
            @Valid @RequestBody CreateRatingRequest request
    ) {
        return ResponseEntity.status(201)
                .body(ApiResponse.created(
                        "평점 등록에 성공했습니다.",
                        ratingService.create(memberId, request)
                ));
    }

    @PatchMapping("/{memberId}/ratings/{ratingId}")
    public ApiResponse<Void> update(
            @PathVariable("memberId") @Positive Long memberId,
            @PathVariable("ratingId") @Positive Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request
    ) {
        ratingService.update(memberId, ratingId, request);
        return ApiResponse.ok("평점 수정에 성공했습니다.", null);
    }

    @DeleteMapping("/{memberId}/ratings/{ratingId}")
    public ResponseEntity<Void> delete(
            @PathVariable("memberId") @Positive Long memberId,
            @PathVariable("ratingId") @Positive Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.noContent().build();
    }
}