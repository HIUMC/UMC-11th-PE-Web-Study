package com.umc.movie.dto.login;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "이메일을 입력해주세요.")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        String email,

        //로그인 단계에서는 비밀번호 규칙까진 검사안함
        //규칙이 바뀌기 전 가입한 회원이 로그인조차 못하게되기 때문
        @NotBlank(message = "비밀번호를 입력해주세요")
        String password) {
}
