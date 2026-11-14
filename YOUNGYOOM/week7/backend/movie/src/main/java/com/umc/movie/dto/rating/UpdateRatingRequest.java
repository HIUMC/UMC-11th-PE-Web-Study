// src/main/java/com/umc/movie/dto/CreateRatingRequest.java
package com.umc.movie.dto.rating;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

//평점 수정에 필요한 별점과 후기를 받음
//수정할 평점의 ID는 URL 경로에서 받는다.
public record UpdateRatingRequest(
        //수정 요청에도 새 별점을 반드시 보내야함
        @NotNull(message = "별점을 입력해주세요.")
        @Min(value = 1, message = "별점은 1점 이상이어야 합니다.")
        @Max(value = 5, message = "별점은 5점 이하여야 합니다.")
        Integer score,

        //이 구현에서는 후기 생략시 기존 후기가 null로 바뀜
        @Size(max = 500, message = "후기는 500자 이하로 입력해주세요.")
        String comment
) {
}