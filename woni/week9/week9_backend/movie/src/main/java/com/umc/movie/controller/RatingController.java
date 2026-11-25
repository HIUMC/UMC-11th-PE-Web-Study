// src/main/java/com/umc/movie/controller/RatingController.java
package com.umc.movie.controller;

import com.umc.movie.annotation.LoginMember;
import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Rating", description = "평점 API (조회는 공개, 등록/수정/삭제는 토큰 필요, 토큰 실패: 401 AUTH401_2/3/4)")
@RestController
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // 5주차에 만든 유저별 평점 조회입니다. 공개 API라 토큰을 받지 않습니다.
    // WebConfig의 excludePathPatterns에 "/members/*/ratings"가 있으므로 @SecurityRequirement를 붙이지 않습니다.
    @Operation(summary = "유저별 평점 목록 조회",
            description = "토큰 불필요(공개 API). 최신 등록 순, page 0부터. "
                    + "성공 200 (공통 응답으로 감싸지 않은 배열) / 없는 회원 404 MEMBER404_1")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공 (RatingResponse 배열)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 해당 회원을 찾을 수 없음")
    })
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(
            @Parameter(description = "평점을 조회할 회원 ID", example = "1") @PathVariable Long memberId,
            @Parameter(description = "페이지 번호 (0부터)", example = "0") @RequestParam(defaultValue = "0") @Min(0) int page,
            @Parameter(description = "페이지 크기 (1~100)", example = "10") @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        return ratingService.getRatingsByMember(memberId, page, size);
    }

    // [선택 미션 2] @LoginMember 적용 (로그인한 회원의 memberId를 Resolver가 주입)
    @Operation(summary = "평점 등록",
            description = "토큰 필요. 토큰의 주인인 회원이 영화 하나에 평점을 남깁니다. "
                    + "성공 201 COMMON201 / 입력값 검증 실패 400 COMMON4001 / 토큰 없음 401 AUTH401_2 / "
                    + "회원 없음 404 MEMBER404_1 / 같은 영화에 중복 등록 409 RATING409_1")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 평점 등록 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 입력값 검증 실패"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2/3/4 토큰 없음, 유효하지 않음, 만료"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 해당 회원을 찾을 수 없음"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "RATING409_1 이미 이 영화에 평점을 남김")
    })
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @Valid @RequestBody CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("평점을 등록했습니다.", response));
    }

    // [선택 미션 2] @LoginMember 적용
    @Operation(summary = "평점 수정",
            description = "토큰 필요. 본인이 작성한 평점의 별점과 후기를 수정합니다. "
                    + "성공 200 COMMON200 / 입력값 검증 실패 400 COMMON4001 / 토큰 없음 401 AUTH401_2 / "
                    + "남의 평점 403 RATING403_1 / 없는 평점 404 RATING404_1")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 평점 수정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 입력값 검증 실패"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2/3/4 토큰 없음, 유효하지 않음, 만료"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 본인이 작성한 평점이 아님"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 해당 평점을 찾을 수 없음")
    })
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @Parameter(description = "수정할 평점 ID", example = "1") @PathVariable Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.update(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", response));
    }

    // [선택 미션 2] @LoginMember 적용
    @Operation(summary = "평점 삭제",
            description = "토큰 필요. 본인이 작성한 평점을 삭제합니다. "
                    + "성공 200 COMMON200 result null / 토큰 없음 401 AUTH401_2 / "
                    + "남의 평점 403 RATING403_1 / 없는 평점 404 RATING404_1")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 평점 삭제 성공 (result null)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2/3/4 토큰 없음, 유효하지 않음, 만료"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 본인이 작성한 평점이 아님"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 해당 평점을 찾을 수 없음")
    })
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @Parameter(description = "삭제할 평점 ID", example = "1") @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }
}
