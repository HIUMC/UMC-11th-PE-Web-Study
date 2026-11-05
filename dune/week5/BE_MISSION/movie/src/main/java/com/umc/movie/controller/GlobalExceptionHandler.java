// src/main/java/com/umc/movie/controller/GlobalExceptionHandler.java
package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // DTO 검증 실패 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(
            MethodArgumentNotValidException exception
    ) {
        String message = exception.getBindingResult()
                .getFieldErrors()
                .get(0)
                .getDefaultMessage();
        return ResponseEntity.badRequest()
                .body(ApiResponse.failure(
                        "COMMON4001",
                        message // 첫 번째 필드 오류의 메시지를 꺼내는 것
                ));
    }

    // DB 제약 위반 처리
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(
            DataIntegrityViolationException exception
    ) {
        return ResponseEntity.status(409)
                .body(ApiResponse.failure(
                        "COMMON4091",
                        "이미 존재하는 데이터입니다."
                ));
    }

    // 코드에서 잘못된 인자라고 예외를 던짐
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(
            IllegalArgumentException exception
    ) {
        return ResponseEntity.status(409).
                body(ApiResponse.failure(
                        "COMMON4092",
                        exception.getMessage()
                        /*
                        throw new IllegalArgumentException("잘못된 별점입니다.");
                        위 문자열은 예외의 message에 저장되므로 getMessage()로 꺼냄.
                         */
                ));
    }

    // 	HTTP 오류
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(
            ResponseStatusException exception
    ) {
        int status = exception.getStatusCode().value();
        return ResponseEntity.status(status)
                .body(ApiResponse.failure(
                        "COMMON" + status,
                        exception.getReason() // HTTP 오류의 이유를 꺼냄.
                ));
    }
}