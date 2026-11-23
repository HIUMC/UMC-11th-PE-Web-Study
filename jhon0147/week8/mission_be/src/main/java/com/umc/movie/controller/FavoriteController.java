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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService favoriteService;

    @PostMapping("/favorites")
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @LoginMember Long memberId, @Valid @RequestBody CreateFavoriteRequest request) {
        return ResponseEntity.status(201).body(
                ApiResponse.created("즐겨찾기를 등록했습니다.", favoriteService.create(memberId, request)));
    }

    @GetMapping("/favorites")
    public ApiResponse<List<FavoriteResponse>> getMyFavorites(@LoginMember Long memberId) {
        return ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", favoriteService.getMyFavorites(memberId));
    }

    @GetMapping("/favorites/{movieId}")
    public ApiResponse<FavoriteStatusResponse> getStatus(
            @LoginMember Long memberId, @Positive @PathVariable Long movieId) {
        return ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", favoriteService.getStatus(memberId, movieId));
    }

    @DeleteMapping("/favorites/{movieId}")
    public ApiResponse<Void> delete(
            @LoginMember Long memberId, @Positive @PathVariable Long movieId) {
        favoriteService.delete(memberId, movieId);
        return ApiResponse.ok("즐겨찾기를 해제했습니다.", null);
    }
}
