package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Favorite", description = "즐겨찾기 API (전부 토큰 필요, 실패: 401 AUTH401_2/3/4)")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @Operation(summary = "즐겨찾기 등록",
            description = "요청 예시: {\"movieId\": 550}. 성공 201 COMMON201 / 중복 409 FAVORITE409_1 / movieId 검증 실패 400")
    @PostMapping("/favorites")
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateFavoriteRequest request
    ) {
        FavoriteResponse response = favoriteService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", response));
    }

    @Operation(summary = "내 즐겨찾기 목록 조회",
            description = "최신 등록 순. 성공 200 COMMON200 (비어 있으면 빈 배열)")
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        List<FavoriteResponse> response = favoriteService.getMyFavorites(memberId);
        return ResponseEntity.ok(ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", response));
    }

    @Operation(summary = "특정 영화 즐겨찾기 여부 조회",
            description = "성공 200 COMMON200, result.isFavorite true/false (즐겨찾기하지 않아도 오류 아님)")
    @GetMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> getStatus(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Parameter(description = "TMDB 영화 ID", example = "550") @PathVariable Long movieId
    ) {
        FavoriteStatusResponse response = favoriteService.getStatus(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", response));
    }

    @Operation(summary = "즐겨찾기 해제",
            description = "성공 200 COMMON200 result null / 없는 즐겨찾기 404 FAVORITE404_1")
    @DeleteMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Parameter(description = "TMDB 영화 ID", example = "550") @PathVariable Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기를 해제했습니다.", null));
    }
}
