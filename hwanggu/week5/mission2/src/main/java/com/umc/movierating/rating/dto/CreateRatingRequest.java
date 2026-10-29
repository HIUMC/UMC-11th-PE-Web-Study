package com.umc.movierating.rating.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record CreateRatingRequest(
        @NotNull Long memberId,
        @NotNull Long movieId,
        @NotNull @DecimalMin("0.5") @DecimalMax("5.0") Double score
) {}
