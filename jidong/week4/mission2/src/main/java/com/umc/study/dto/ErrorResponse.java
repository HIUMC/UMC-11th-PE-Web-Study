package com.umc.study.dto;

import java.util.Map;

// 모든 오류 응답을 같은 모양으로 맞추기 위한 DTO
public record ErrorResponse(
        int status,
        String message,
        Map<String, String> fieldErrors
) {
    public static ErrorResponse of(int status, String message) {
        return new ErrorResponse(status, message, Map.of());
    }
}
