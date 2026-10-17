package com.umc.study.exception;

import java.util.Map;

// 오류 응답의 약속 - 어떤 오류든 같은 모양으로 내려줌
// errors: 필드별 검증 실패 이유 (검증 오류가 아니면 빈 Map)
public record ErrorResponse(
        int status,
        String code,
        String message,
        Map<String, String> errors
) {
    public static ErrorResponse of(int status, String code, String message) {
        return new ErrorResponse(status, code, message, Map.of());
    }
}
