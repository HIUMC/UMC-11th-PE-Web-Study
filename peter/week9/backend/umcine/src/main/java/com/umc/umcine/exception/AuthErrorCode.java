package com.umc.umcine.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AuthErrorCode implements ErrorCode {
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "AUTH401_1", "이메일 또는 비밀번호가 올바르지 않습니다."),
    LOGIN_REQUIRED(HttpStatus.UNAUTHORIZED, "AUTH401_2", "로그인이 필요한 요청입니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH401_3", "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH401_4", "토큰이 만료되었습니다. 다시 로그인해주세요.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
