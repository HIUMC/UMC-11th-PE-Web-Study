// src/main/java/com/umc/movie/dto/MovieRecordResponse.java
package com.umc.movie.dto;

import com.umc.movie.dto.favorite.FavoriteResponse;

// 영화 기록 등록 결과를 담는 응답 DTO
public record MovieRecordResponse(
        RatingResponse rating, //등록 평점 정보
        FavoriteResponse favorite //등록 즐겨찾기 정보, 평점만 등록하면 null 처리
) {

}
