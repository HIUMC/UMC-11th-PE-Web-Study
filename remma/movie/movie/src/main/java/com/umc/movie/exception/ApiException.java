// src/main/java/com/umc/movie/exception/ApiException.java
package com.umc.movie.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 비즈니스 로직에서 HTTP 상태 코드 + 응답 코드 + 메시지를 함께 던지기 위한 예외.
 * GlobalExceptionHandler 에서 ApiResponse.failure 형태로 변환됩니다.
 */
@Getter
public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final String code;

    public ApiException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
