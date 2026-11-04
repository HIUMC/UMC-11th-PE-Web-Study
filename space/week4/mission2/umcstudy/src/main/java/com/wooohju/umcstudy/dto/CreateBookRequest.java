package com.wooohju.umcstudy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateBookRequest(
        @NotNull
        Long categoryId,

        @NotBlank
        String title,

        @NotBlank
        String description
) {
}
