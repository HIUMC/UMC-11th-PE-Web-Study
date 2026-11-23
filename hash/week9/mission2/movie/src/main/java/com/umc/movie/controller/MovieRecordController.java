package com.umc.movie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import com.umc.movie.auth.LoginMember;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.service.MovieRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@org.springframework.web.bind.annotation.RequestMapping(produces = "application/json")
@RequiredArgsConstructor
public class MovieRecordController {

    private final MovieRecordService movieRecordService;

    @PostMapping("/movie-records")
    @Operation(summary = "영화 기록 저장", description = "addToFavorites가 true이면 평점과 즐겨찾기를 한 트랜잭션에서 저장합니다. false이면 favorite는 null입니다.")
    public ResponseEntity<ApiResponse<MovieRecordResponse>> create(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @Valid @RequestBody CreateMovieRecordRequest request
    ) {
        MovieRecordResponse result = movieRecordService.create(memberId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("영화 기록을 저장했습니다.", result));
    }
}
