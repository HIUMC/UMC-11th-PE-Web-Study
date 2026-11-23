
// src/main/java/com/umc/movie/dto/CreateMovieRecordRequest.java
package com.umc.movie.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

// 영화 평점을 등록할 때 별점, 코멘트, 즐겨찾기 추가 여부를 받는 DTO입니다.
public record CreateMovieRecordRequest
        (//평점을 남길 영화의 TMDB ID
         @NotNull(message = "영화 ID는 필수입니다.")
         @Positive(message = "영화 ID는 양수여야 합니다.")
         Long movieId,

         //별점은 필수이며 1~5점까지 입력 가능
         @NotNull(message = "별점은 필수입니다.")
         @Min(value = 1, message = "별점은 1점 이상이어야 합니다.")
         @Max(value = 5, message = "별점은 5점 이하이어야 합니다.")
         Integer score,

         //코멘트는 생략 가능
         String comment,

         //true면 즐겨찾기도 추가하고, false면 평점만 등록
         //Boolean과 @NotNull을 사용해 false를 보낸 경우와 값을
         @NotNull(message = "즐겨찾기 추가 여부는 필수입니다.")
         Boolean addToFavorites) {
}
