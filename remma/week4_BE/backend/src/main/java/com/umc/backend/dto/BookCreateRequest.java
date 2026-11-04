package com.umc.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BookCreateRequest {

    @NotNull(message = "categoryId는 필수입니다.")
    private Long categoryId;

    @NotBlank(message = "title은 필수입니다.")
    private String title;

    @NotBlank(message = "description은 필수입니다.")
    private String description;
}