package com.umc.movie.dto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @Schema(description = "가입한 이메일", example = "week9@umc.com")
        @NotBlank(message = "이메일을 입력해주세요.")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @Size(max = 254, message = "이메일은 254자 이하로 입력해주세요.")
        String email,
        @Schema(description = "가입한 비밀번호", example = "Umc!1234", format = "password")
        @NotBlank(message = "비밀번호를 입력해주세요.")
        String password
) {}
