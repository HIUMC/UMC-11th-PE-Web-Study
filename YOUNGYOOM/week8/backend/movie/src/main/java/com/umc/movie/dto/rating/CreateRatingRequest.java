// src/main/java/com/umc/movie/dto/CreateRatingRequest.java
package com.umc.movie.dto.rating;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

//평점을 등록할 때 요청 본문에서 받는 데이터
public record CreateRatingRequest(
        //영화 ID는 필수이며 0보다 커야함
        @NotNull(message = "영화 ID를 입력해주세요.")
        @Positive(message = "영화 ID는 양수여야 합니다.")
        Long movieId,

        //별점은 필수이며, 1점부터 5점까지 입력 가능
        @NotNull(message = "별점을 입력해주세요.")
        @Min(value = 1, message = "별점은 1점 이상이어야 합니다.")
        @Max(value = 5, message = "별점은 5점 이하여야 합니다.")
        Integer score,

        //후기는 생략 가능(NotNULL 아님)하며 입력하면 500자 이하여야함
        @Size(max = 500, message = "후기는 500자 이하로 입력해주세요.")
        String comment
) {
}