package com.umc.movie.controller;

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
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @LoginMember Long memberId,
            @Valid @RequestBody CreateFavoriteRequest request
    ) {
        FavoriteResponse result = favoriteService.create(memberId, request.movieId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", result));
    }

    @GetMapping
    public ApiResponse<List<FavoriteResponse>> getFavorites(@LoginMember Long memberId) {
        return ApiResponse.ok("즐겨찾기 목록을 조회했습니다.", favoriteService.getFavorites(memberId));
    }

    @GetMapping("/{movieId}")
    public ApiResponse<FavoriteStatusResponse> getStatus(
            @LoginMember Long memberId,
            @PathVariable("movieId") @Positive(message = "영화 ID는 양수여야 합니다.") Long movieId
    ) {
        return ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", favoriteService.getStatus(memberId, movieId));
    }

    @DeleteMapping("/{movieId}")
    public ApiResponse<Void> delete(
            @LoginMember Long memberId,
            @PathVariable("movieId") @Positive(message = "영화 ID는 양수여야 합니다.") Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        return ApiResponse.ok("즐겨찾기를 해제했습니다.", null);
    }
}