package com.umc.movie.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
public record CreateFavoriteRequest(@NotNull @Positive @Schema(description = "TMDB 영화 ID (양수)", example = "550")
        Long movieId) {}
