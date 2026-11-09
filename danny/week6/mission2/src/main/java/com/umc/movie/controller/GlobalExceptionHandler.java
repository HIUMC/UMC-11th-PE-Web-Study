package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.exception.DuplicateException;
import com.umc.movie.exception.DuplicateType;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(ApiResponse.failure("COMMON4001", message));
    }

    // 별점에 "abc"나 3.5를 보내는 경우처럼 JSON을 요청 객체로 바꿀 수 없을 때입니다.
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotReadable(HttpMessageNotReadableException exception) {
        return ResponseEntity.badRequest().body(ApiResponse.failure("COMMON4002", "요청 본문의 형식이 올바르지 않습니다."));
    }

    @ExceptionHandler(DuplicateException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicate(DuplicateException exception) {
        return duplicateResponse(exception.getType());
    }

    // 사전 중복 체크를 동시에 통과한 요청은 DB UNIQUE 제약에 걸립니다.
    // 이때도 사전 체크와 같은 응답을 주기 위해 어떤 키가 위반됐는지 확인합니다.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException exception) {
        DuplicateType type = findDuplicateType(exception.getMostSpecificCause().getMessage());
        if (type != null) {
            return duplicateResponse(type);
        }
        return ResponseEntity.status(409).body(ApiResponse.failure("COMMON4091", "이미 존재하는 데이터입니다."));
    }

    private ResponseEntity<ApiResponse<Void>> duplicateResponse(DuplicateType type) {
        return ResponseEntity.status(409).body(ApiResponse.failure(type.getCode(), type.getMessage()));
    }

    /**
     * MySQL 메시지 예: Duplicate entry 'a@b.com' for key 'member.email'
     * 입력값에 "email" 같은 단어가 들어 있어도 헷갈리지 않도록 "for key" 뒤의 키 이름만 봅니다.
     */
    private DuplicateType findDuplicateType(String message) {
        int keyIndex = message == null ? -1 : message.lastIndexOf(" for key ");
        if (keyIndex < 0) {
            return null;
        }

        String key = message.substring(keyIndex).toLowerCase();
        if (key.contains("rating") || key.contains("movie")) {
            return DuplicateType.RATING;
        }
        if (key.contains("email")) {
            return DuplicateType.EMAIL;
        }
        if (key.contains("nickname")) {
            return DuplicateType.NICKNAME;
        }
        return null;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.status(409).body(ApiResponse.failure("COMMON4092", exception.getMessage()));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(ResponseStatusException exception) {
        int status = exception.getStatusCode().value();
        return ResponseEntity.status(status)
                .body(ApiResponse.failure("COMMON" + status, exception.getReason()));
    }
}
