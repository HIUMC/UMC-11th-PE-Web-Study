package com.umc.study.dto;

import jakarta.validation.constraints.NotNull;

public record RentalCreateRequest(
        @NotNull Long userId,
        @NotNull Long bookId
) {
}
