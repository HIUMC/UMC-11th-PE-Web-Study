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

import com.umc.movie.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
// 파일 상단 import 목록에 추가
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequiredArgsConstructor
@Tag(name = "평점", description = "영화 평점 등록, 수정, 삭제 및 회원별 평점 조회 API")
//조회와 등록/수정/삭제가 다르게 시작해서 메서드마다 전체 경로 지정\

public class RatingController {


    private final RatingService ratingService;

    //GetMapping
    @Operation(
            summary = "회원별 평점 조회",
            description = "지정한 회원의 평점 목록을 페이지 단위로 조회합니다. 토큰이 필요하지 않습니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "회원별 평점 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "페이지 범위 오류 (COMMON400)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "회원을 찾을 수 없음 (MEMBER404_1)"),
    })
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

    //PostMapping
    @Operation(
            summary = "평점 등록",
            description = "영화에 별점과 후기를 등록합니다. Bearer 토큰이 필요합니다.",
            security = @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "평점 등록 성공 (COMMON201)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "요청값 검증 실패 (COMMON4001)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "인증 헤더 누락 또는 형식 오류 (AUTH401_2), "
                            + "유효하지 않은 토큰 (AUTH401_3), 만료된 토큰 (AUTH401_4)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "회원을 찾을 수 없음 (MEMBER404_1)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "이미 이 영화에 평점을 등록함 (RATING409_1)")
    })
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

    //PatchMapping
    @Operation(
            summary = "평점 수정",
            description = "내가 작성한 평점의 별점과 후기를 수정합니다. Bearer 토큰이 필요합니다.",
            security = @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "평점 수정 완료"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "요청값 검증 실패 (COMMON4001)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "인증 헤더 누락 또는 형식 오류 (AUTH401_2), "
                            + "유효하지 않은 토큰 (AUTH401_3), 만료된 토큰 (AUTH401_4)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403", description = "다른 회원이 작성한 평점은 수정할 수 없음 (RATING403_1)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "평점을 찾을 수 없음 (RATING404_1)")
    })
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

    //DeleteMapping
    @Operation(
            summary = "평점 삭제",
            description = "내가 작성한 평점을 삭제합니다. Bearer 토큰이 필요합니다.",
            security = @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "평점 삭제 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "인증 헤더 누락 또는 형식 오류 (AUTH401_2), "
                            + "유효하지 않은 토큰 (AUTH401_3), 만료된 토큰 (AUTH401_4)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403", description = "다른 회원이 작성한 평점은 삭제할 수 없음 (RATING403_1)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "평점을 찾을 수 없음 (RATING404_1)")
    })
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