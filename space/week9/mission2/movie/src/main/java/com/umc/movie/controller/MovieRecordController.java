package com.umc.movie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import static com.umc.movie.config.SwaggerConfig.BEARER_AUTH;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.MovieRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "MovieRecord")
@RestController
@RequiredArgsConstructor
public class MovieRecordController {
    private final MovieRecordService service;

    @Operation(summary = "평점과 즐겨찾기를 하나의 트랜잭션으로 저장", description = "Bearer 토큰이 필요합니다. 로그인한 회원 ID는 토큰에서 추출합니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201: rating과 favorite 반환. addToFavorites=false이면 favorite=null"),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2: 토큰 누락 / AUTH401_3: 유효하지 않은 토큰 / AUTH401_4: 만료된 토큰",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"토큰 누락\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001: 요청 필드 검증 실패",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"COMMON4001\", \"message\": \"요청 필드 검증 실패\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1: 회원을 찾을 수 없음",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"MEMBER404_1\", \"message\": \"회원을 찾을 수 없음\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "RATING409_1: 평점 중복 / FAVORITE409_1: 즐겨찾기 중복 / COMMON4091: DB 고유 제약 위반",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"RATING409_1\", \"message\": \"평점 중복\", \"result\": null}")))
            })
    @SecurityRequirement(name = BEARER_AUTH)
    @PostMapping("/movie-records")
    public ResponseEntity<ApiResponse<MovieRecordResponse>> create(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Valid @RequestBody CreateMovieRecordRequest request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.created("영화 기록을 저장했습니다.", service.create(memberId, request)));
    }
}
