package com.umc.dune_BE_study.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateBookRequest( // record: 데이터를 담기 위한 간결한 Java 클래스
        @NotNull Long categoryId, // NotNull: categoryId가 null이면 안 된다
        @NotBlank @Size(max = 100) String title, // NotBlank: 문자열이 비어 있으면 안 된다
        String description
) {}