package com.umc.umcine.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum GeneralErrorCode implements ErrorCode {
    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "COMMON4001", "입력값을 확인해주세요."),
    UNREADABLE_BODY(HttpStatus.BAD_REQUEST, "COMMON4001", "요청 본문이 없거나 JSON 형식이 올바르지 않습니다."),
    DUPLICATE_DATA(HttpStatus.CONFLICT, "COMMON4091", "이미 존재하는 데이터입니다."),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON5001", "서버 내부 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
