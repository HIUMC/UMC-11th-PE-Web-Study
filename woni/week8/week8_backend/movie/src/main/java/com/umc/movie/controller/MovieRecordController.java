package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.MovieRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "MovieRecord", description = "영화 기록 API (토큰 필요, 실패: 401 AUTH401_2/3/4)")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequiredArgsConstructor
public class MovieRecordController {

    private final MovieRecordService movieRecordService;

    @Operation(summary = "영화 기록 저장 (평점 + 즐겨찾기 트랜잭션)",
            description = "요청 예시: {\"movieId\": 238, \"score\": 5, \"comment\": \"다시 보고 싶은 영화입니다.\", \"addToFavorites\": true}. "
                    + "성공 201 COMMON201 (rating, favorite) / 평점 중복 409 RATING409_1 / 즐겨찾기 중복 409 FAVORITE409_1 / 검증 실패 400")
    @PostMapping("/movie-records")
    public ResponseEntity<ApiResponse<MovieRecordResponse>> create(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateMovieRecordRequest request
    ) {
        MovieRecordResponse response = movieRecordService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("영화 기록을 저장했습니다.", response));
    }
}
