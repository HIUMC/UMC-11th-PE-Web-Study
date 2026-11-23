package com.umc.movie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import com.umc.movie.auth.LoginMember;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.service.FavoriteService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/favorites", produces = "application/json")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    @Operation(summary = "즐겨찾기 등록", description = "JWT 회원의 즐겨찾기를 등록합니다. 중복은 409 FAVORITE409_1입니다.")
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @Valid @RequestBody CreateFavoriteRequest request
    ) {
        FavoriteResponse result = favoriteService.create(memberId, request.movieId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", result));
    }

    @GetMapping
    @Operation(summary = "내 즐겨찾기 조회", description = "JWT 회원의 목록을 최신순으로 반환합니다. 빈 목록도 200입니다.")
    public ApiResponse<List<FavoriteResponse>> getFavorites(@Parameter(hidden = true) @LoginMember Long memberId) {
        return ApiResponse.ok("즐겨찾기 목록을 조회했습니다.", favoriteService.getFavorites(memberId));
    }

    @GetMapping("/{movieId}")
    @Operation(summary = "즐겨찾기 여부 조회", description = "JWT 회원의 등록 여부를 반환합니다. 기록이 없어도 200과 false입니다.")
    public ApiResponse<FavoriteStatusResponse> getStatus(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @PathVariable("movieId") @Positive(message = "영화 ID는 양수여야 합니다.") Long movieId
    ) {
        return ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", favoriteService.getStatus(memberId, movieId));
    }

    @DeleteMapping("/{movieId}")
    @Operation(summary = "즐겨찾기 해제", description = "본인의 즐겨찾기를 해제합니다. 존재하지 않으면 404 FAVORITE404_1입니다.")
    public ApiResponse<Void> delete(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @PathVariable("movieId") @Positive(message = "영화 ID는 양수여야 합니다.") Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        return ApiResponse.ok("즐겨찾기를 해제했습니다.", null);
    }
}
