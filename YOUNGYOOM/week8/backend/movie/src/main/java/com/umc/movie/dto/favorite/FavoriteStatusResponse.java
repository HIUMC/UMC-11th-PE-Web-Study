// src/main/java/com/umc/movie/dto/Favorite/FavoriteStatusResponse.java
package com.umc.movie.dto.favorite;

// 로그인한 회원이 특정 영화를 즐겨찾기 했는지 전달하는 응답 DTO
public record FavoriteStatusResponse(
        //즐겨찾기에 등록되어있으면 true, 아니면 false
        boolean isFavorite
) {

}
