package com.umc.movie.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Schema(description = "가입에 사용한 이메일", example = "challenger@umc.com")
        @NotBlank @Email String email,

        @Schema(description = "가입에 사용한 비밀번호", example = "UmcMovie9!")
        @NotBlank String password
) {}
