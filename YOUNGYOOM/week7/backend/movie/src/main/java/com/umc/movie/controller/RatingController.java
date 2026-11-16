package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.rating.UpdateRatingRequest;
import com.umc.movie.dto.rating.CreateRatingRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
//조회와 등록/수정/삭제가 다르게 시작해서 메서드마다 전체 경로 지정
public class RatingController {

    private final RatingService ratingService;

    @GetMapping("/members/{memberId}/ratings")
    public Page<RatingResponse> getMemberRatings(
            @PathVariable Long memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // 회원 ID와 페이지 정보를 서비스에 전달
        //해당 회원이 작성한 별점/코멘트 목록을 size 개수 따라서 보여줌
        return ratingService.getRatingsByMember(memberId, page, size);
    }

    //평점 등록, URL 에서 회원 ID를 받고, JSON 에서 영화 Id, 별점, 후기를 받음
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            //인터셉터가 JWT에서 확인해 요청에 저장한 회원 ID를 꺼냄
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Valid @RequestBody CreateRatingRequest request
    ) {
        //입력값 검증을 통과하면 서비스가 평점을 저장하고 새 평점 ID를 돌려줌
        RatingResponse ratingId = ratingService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("평점 등록에 성공했습니다.", ratingId));
    }

    //평점 수정, ratingId로 수정할 평점 지정하고, memberId는 작성자 확인에 씀
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId, // 여기 수정
            @PathVariable Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.update(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", response));
    }

    //평점 삭제, 서비스가 작성자를 확인하고 삭제하면, 본문 없이 HTTP 204 반환
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId
    ) {
        //  회원 ID, 평점 ID 순서로 전달합니다.
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }


}