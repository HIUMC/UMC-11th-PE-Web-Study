package com.umc.movie.dto;

// 즐겨찾기 안 한 것도 정상 상태라서 오류 대신 false로 알려 줌
public record FavoriteStatusResponse(
        boolean isFavorite
) {
}
