package com.example.mission2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateBookRequest(
        @NotNull Long categoryId,
        @NotBlank String title,
        String description) { }
