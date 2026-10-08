package com.umc.study.dto;

import jakarta.validation.constraints.NotNull;

public record CreateRentalRequest(
        @NotNull Long userId,
        @NotNull Long bookId
) {}