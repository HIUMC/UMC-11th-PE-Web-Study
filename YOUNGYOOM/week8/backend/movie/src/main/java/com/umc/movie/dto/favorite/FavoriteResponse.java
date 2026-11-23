// src/main/java/com/umc/movie/dto/Favorite/FavoriteResponse.java
package com.umc.movie.dto.favorite;

import com.umc.movie.entity.Favorite;

import java.time.LocalDateTime;

//즐겨찾기 항목 정보를 클라이언트에 전달하는 응답 DTO
public record FavoriteResponse(
        Long favoriteId,
        Long movieId,
        LocalDateTime createdAt
) {
    //Favorite 엔티티에서 응답에 필요한 값만 꺼내 DTO 로 반환
    public static FavoriteResponse from(Favorite favorite) {
        return new FavoriteResponse(
                favorite.getFavoriteId(),
                favorite.getMovieId(),
                favorite.getCreatedAt()
        );
    }
}
