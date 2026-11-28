package com.umc.movie.controller;

import io.swagger.v3.oas.annotations.responses.ApiResponses;
import com.umc.movie.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@RestController
@RequiredArgsConstructor
@Tag(name = "평점", description = "영화 평점 등록·수정·삭제와 회원별 조회 API")
public class RatingController {

    private final RatingService ratingService;

    @Operation(
            summary = "회원별 평점 조회",
            description = """
                지정한 회원이 작성한 평점 목록을 최신 등록 순서로 조회합니다.
                토큰 없이 호출할 수 있는 공개 API입니다.
                회원은 존재하지만 작성한 평점이 없으면 빈 배열을 반환합니다.
                응답은 공통 응답으로 감싸지 않은 평점 배열입니다.
                """
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "조회 성공: 평점 배열 반환, 평점이 없으면 []"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "COMMON4001: memberId를 Long 타입으로 변환할 수 없음"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "MEMBER404_1: 해당 회원을 찾을 수 없음"
            )
    })

    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(
            @PathVariable Long memberId
    ) {
        return ratingService.getRatingsByMember(memberId);
    }

    @Operation(
            summary = "평점 등록",
            description = """
                로그인한 회원이 영화에 평점을 등록합니다.
                Bearer 토큰이 필요하며, 회원 ID는 토큰에서 가져옵니다.
                같은 영화에 이미 평점을 남겼다면 409와 RATING409_1을 반환합니다.
                """
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)

    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "COMMON201: 평점 등록 성공"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "COMMON4001: 필수 입력 누락 또는 입력값 검증 실패"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = """
                        인증 실패:
                        AUTH401_2 — 토큰 없음 또는 Bearer 형식이 아님
                        AUTH401_3 — 유효하지 않은 토큰
                        AUTH401_4 — 만료된 토큰
                        """
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "MEMBER404_1: 토큰에 해당하는 회원을 찾을 수 없음"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = """
                        RATING409_1: 이미 같은 영화에 평점을 등록함
                        COMMON4091: DB 제약 조건 위반
                        """
            )
    })

    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);

        return ResponseEntity.status(201)
                .body(ApiResponse.created("평점을 등록했습니다.", response));
    }

    @Operation(
            summary = "평점 수정",
            description = """
                로그인한 회원이 본인의 평점과 후기를 수정합니다.
                Bearer 토큰이 필요하며, 회원 ID는 토큰에서 가져옵니다.
                다른 회원의 평점은 수정할 수 없습니다.
                """
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "COMMON200: 평점 수정 성공"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "COMMON4001: 필수 입력 누락 또는 입력값 검증 실패"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = """
                        인증 실패:
                        AUTH401_2 — 토큰 없음 또는 Bearer 형식이 아님
                        AUTH401_3 — 유효하지 않은 토큰
                        AUTH401_4 — 만료된 토큰
                        """
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "RATING403_1: 다른 회원이 작성한 평점"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "RATING404_1: 해당 평점을 찾을 수 없음"
            )
    })

    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId,
            @RequestBody @Valid UpdateRatingRequest request
    ) {
        RatingResponse response =
                ratingService.update(memberId, ratingId, request);

        return ResponseEntity.ok(
                ApiResponse.ok("평점을 수정했습니다.", response)
        );
    }

    @Operation(
            summary = "평점 삭제",
            description = """
                로그인한 회원이 본인의 평점을 삭제합니다.
                Bearer 토큰이 필요하며, 회원 ID는 토큰에서 가져옵니다.
                다른 회원의 평점은 삭제할 수 없습니다.
                삭제 성공 시 200과 공통 응답을 반환하며 result는 null입니다.
                """
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "COMMON200: 평점 삭제 성공, result는 null"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "COMMON4001: ratingId를 Long 타입으로 변환할 수 없음"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = """
                        인증 실패:
                        AUTH401_2 — 토큰 없음 또는 Bearer 형식이 아님
                        AUTH401_3 — 유효하지 않은 토큰
                        AUTH401_4 — 만료된 토큰
                        """
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "RATING403_1: 다른 회원이 작성한 평점"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "RATING404_1: 해당 평점을 찾을 수 없음"
            )
    })

    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);

        return ResponseEntity.ok(
                ApiResponse.ok("평점을 삭제했습니다.", null)
        );
    }
}