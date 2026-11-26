package com.umc.movie.controller;
import com.umc.movie.config.ApiExamples;
import com.umc.movie.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.umc.movie.auth.LoginMember;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.service.MovieRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "영화 기록", description = "평점과 즐겨찾기를 하나의 트랜잭션으로 저장")
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
@ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "토큰 누락", value = ApiExamples.UNAUTHORIZED),
                                @ExampleObject(name = "잘못된 토큰", value = ApiExamples.INVALID_TOKEN),
                                @ExampleObject(name = "만료", value = ApiExamples.EXPIRED_TOKEN)
                        }))
})
@RequiredArgsConstructor
public class MovieRecordController {
    private final MovieRecordService movieRecordService;

    @Operation(summary = "영화 기록 저장", description = "인증 필요. 평점과 선택한 즐겨찾기를 함께 저장합니다. 어느 하나가 실패하면 모두 취소됩니다. addToFavorites=false면 평점만 저장합니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 저장 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 입력 형식 또는 검증 오류",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "입력 오류", value = ApiExamples.BAD_REQUEST)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "회원 없음", value = ApiExamples.MEMBER_NOT_FOUND)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "RATING409_1 평점 중복 / FAVORITE409_1 즐겨찾기 중복",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "평점 중복", value = ApiExamples.RATING_CONFLICT),
                                @ExampleObject(name = "즐겨찾기 중복", value = ApiExamples.FAVORITE_CONFLICT)
                        }))
    })
    @PostMapping("/movie-records")
    public ResponseEntity<ApiResponse<MovieRecordResponse>> create(
            @Parameter(hidden = true) @LoginMember Long memberId, @Valid @RequestBody CreateMovieRecordRequest request) {
        return ResponseEntity.status(201).body(
                ApiResponse.created("영화 기록을 저장했습니다.", movieRecordService.create(memberId, request)));
    }
}
