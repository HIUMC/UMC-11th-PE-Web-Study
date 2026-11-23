package com.umc.movie.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "이메일을 입력해주세요.")
        @Email(message = "올바른 이메일 형식이 아닙니다.")
        @Size(max = 254)
        @Schema(example = "hash9@example.com")
        String email,

        @NotBlank(message = "비밀번호를 입력해주세요.")
        @Size(max = 72)
        @Schema(example = "Workbook9!Test")
        String password
) {
    @Override
    public String toString() {
        return "LoginRequest[password=<redacted>]";
    }
}
