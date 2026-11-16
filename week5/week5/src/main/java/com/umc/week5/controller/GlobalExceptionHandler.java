package com.umc.week5.controller;

import com.umc.week5.dto.ApiResponse;
import com.umc.week5.exception.ErrorCode;
import com.umc.week5.exception.GeneralException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 서비스에서 직접 던진 예외 (중복 이메일/닉네임/평점, 403, 404 ...)
    @ExceptionHandler(GeneralException.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(GeneralException exception) {
        return toResponse(exception.getErrorCode(), exception.getErrorCode().getMessage());
    }

    // @Valid 검증 실패 (이메일 형식, 비밀번호 규칙, 별점 1~5 ...)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return toResponse(ErrorCode.INVALID_INPUT, message);
    }

    // JSON 파싱 실패 (예: "score": "abc", 3.5)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotReadable(HttpMessageNotReadableException exception) {
        return toResponse(ErrorCode.INVALID_INPUT, "요청 본문 형식이 올바르지 않습니다.");
    }

    // 경로 변수 타입 오류 (예: /members/abc/ratings)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException exception) {
        return toResponse(ErrorCode.INVALID_INPUT, exception.getName() + " 값의 형식이 올바르지 않습니다.");
    }

    // 동시 요청으로 사전 검사를 통과해도 DB UNIQUE 제약이 최종적으로 막아줍니다.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException exception) {
        return toResponse(ErrorCode.DUPLICATE_DATA, ErrorCode.DUPLICATE_DATA.getMessage());
    }

    private ResponseEntity<ApiResponse<Void>> toResponse(ErrorCode errorCode, String message) {
        return ResponseEntity.status(errorCode.getStatus())
                .body(ApiResponse.failure(errorCode.getCode(), message));
    }
}
