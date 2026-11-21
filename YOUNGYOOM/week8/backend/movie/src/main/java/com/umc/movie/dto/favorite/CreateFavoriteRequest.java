// src/main/java/com/umc/movie/dto/favorite/CreateFavoriteRequest.java

package com.umc.movie.dto.favorite;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateFavoriteRequest(
        //영화 ID는 필수이며 0보다 커야함
        @NotNull(message = "영화 ID는 필수입니다.")
        @Positive(message = "영화 ID는 양수여야 합니다.")
        Long movieId

) {
}