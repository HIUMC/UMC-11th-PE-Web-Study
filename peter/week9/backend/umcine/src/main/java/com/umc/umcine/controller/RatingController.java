package com.umc.umcine.controller;

import com.umc.umcine.dto.ApiResponse;
import com.umc.umcine.dto.CreateRatingRequest;
import com.umc.umcine.dto.RatingResponse;
import com.umc.umcine.dto.UpdateRatingRequest;
import com.umc.umcine.dto.ReplaceRatingRequest;
import com.umc.umcine.interceptor.AuthInterceptor;
import com.umc.umcine.service.RatingService;
import com.umc.umcine.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
@Tag(name = "평점", description = "영화 평점 등록, 수정, 삭제와 회원별 조회 API")
public class RatingController {

    private final RatingService ratingService;

    @Operation(summary = "회원별 평점 조회", description = "토큰 없이 조회할 수 있는 공개 API입니다. 해당 회원의 평점을 최신순으로 반환합니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "평점 배열 반환. 평점이 없으면 빈 배열"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 요청 형식 또는 입력값 오류"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음")
    })
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(
            @PathVariable Long memberId
    ) {
        return ratingService.getRatingsByMember(memberId);
    }

    @Operation(summary = "평점 등록", description = "JWT 인증이 필요합니다. 같은 회원은 같은 영화에 한 번만 평점을 등록할 수 있습니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 평점 등록 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 요청 형식 또는 입력값 오류"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음, AUTH401_3 유효하지 않은 토큰, AUTH401_4 만료된 토큰"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "RATING409_1 평점 중복, COMMON4091 DB UNIQUE 위반")
    })
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Valid @RequestBody CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);

        return ResponseEntity.status(201)
                .body(ApiResponse.created("평점을 등록했습니다.", response));
    }

    @Operation(summary = "평점 부분 수정", description = "JWT 인증과 작성자 권한이 필요합니다. 생략한 항목은 유지하고 comment에 null을 보내면 후기를 삭제합니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 평점 수정 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 요청 형식 또는 입력값 오류"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음, AUTH401_3 유효하지 않은 토큰, AUTH401_4 만료된 토큰"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 다른 회원의 평점"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 평점 없음")
    })
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request
    ) {
        RatingResponse response =
                ratingService.update(memberId, ratingId, request);

        return ResponseEntity.ok(
                ApiResponse.ok("평점을 수정했습니다.", response)
        );
    }

    @Operation(summary = "평점 전체 교체", description = "JWT 인증과 작성자 권한이 필요합니다. score는 필수이며 comment를 생략하거나 null로 보내면 후기를 삭제합니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 평점 교체 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 요청 형식 또는 입력값 오류"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음, AUTH401_3 유효하지 않은 토큰, AUTH401_4 만료된 토큰"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 다른 회원의 평점"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 평점 없음")
    })
    @PutMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> replace(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId,
            @Valid @RequestBody ReplaceRatingRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.",
                ratingService.replace(memberId, ratingId, request)));
    }

    @Operation(summary = "평점 삭제", description = "JWT 인증과 작성자 권한이 필요합니다. 평점을 삭제하고 result는 null로 반환합니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 평점 삭제 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 요청 형식 또는 입력값 오류"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음, AUTH401_3 유효하지 않은 토큰, AUTH401_4 만료된 토큰"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 다른 회원의 평점"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 평점 없음")
    })
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);

        return ResponseEntity.ok(
                ApiResponse.ok("평점을 삭제했습니다.", null)
        );
    }
}