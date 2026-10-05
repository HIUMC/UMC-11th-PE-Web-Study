package com.umc.mission_be.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateRentalRequest(
        @NotNull @Positive Long userId,
        @NotNull @Positive Long bookId
) {
}
