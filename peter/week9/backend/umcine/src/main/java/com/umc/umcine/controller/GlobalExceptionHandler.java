package com.umc.umcine.controller;

import com.umc.umcine.dto.ApiResponse;
import com.umc.umcine.exception.ApiException;
import com.umc.umcine.exception.ErrorCode;
import com.umc.umcine.exception.GeneralErrorCode;
import com.umc.umcine.exception.DatabaseErrorClassifier;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleApiException(ApiException exception) {
        return ResponseEntity.status(exception.getStatus())
                .body(ApiResponse.failure(exception.getCode(), exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse(GeneralErrorCode.INVALID_REQUEST.getMessage());
        return ResponseEntity.badRequest().body(ApiResponse.failure(GeneralErrorCode.INVALID_REQUEST.getCode(), message));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnreadableBody(HttpMessageNotReadableException exception) {
        return failure(GeneralErrorCode.UNREADABLE_BODY);
    }

    @ExceptionHandler({MethodArgumentTypeMismatchException.class, HandlerMethodValidationException.class})
    public ResponseEntity<ApiResponse<Void>> handleInvalidParameter(Exception exception) {
        return failure(GeneralErrorCode.INVALID_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException exception) {
        if (DatabaseErrorClassifier.isUniqueViolation(exception)) {
            return failure(GeneralErrorCode.DUPLICATE_DATA);
        }
        log.error("Unexpected database integrity violation", exception);
        return failure(GeneralErrorCode.INTERNAL_ERROR);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException exception) {
        log.error("Unexpected internal argument error", exception);
        return failure(GeneralErrorCode.INTERNAL_ERROR);
    }

    private ResponseEntity<ApiResponse<Void>> failure(ErrorCode errorCode) {
        return ResponseEntity.status(errorCode.getStatus())
                .body(ApiResponse.failure(errorCode.getCode(), errorCode.getMessage()));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(ResponseStatusException exception) {
        int status = exception.getStatusCode().value();
        return ResponseEntity.status(status)
                .body(ApiResponse.failure("COMMON" + status, exception.getReason()));
    }
}
