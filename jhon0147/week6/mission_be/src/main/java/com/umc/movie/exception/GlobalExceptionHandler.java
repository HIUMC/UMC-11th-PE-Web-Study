package com.umc.movie.exception;

import com.umc.movie.dto.ApiResponse;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Locale;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleApi(ApiException exception) {
        return ResponseEntity.status(exception.getStatus())
                .body(ApiResponse.failure(exception.getCode(), exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getAllErrors().stream()
                .map(MessageSourceResolvable::getDefaultMessage)
                .findFirst().orElse("입력값을 확인해주세요.");
        return badRequest(message);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodValidation(HandlerMethodValidationException exception) {
        String message = exception.getParameterValidationResults().stream()
                .flatMap(result -> result.getResolvableErrors().stream())
                .map(MessageSourceResolvable::getDefaultMessage)
                .findFirst().orElse("입력값을 확인해주세요.");
        return badRequest(message);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnreadable(HttpMessageNotReadableException exception) {
        return badRequest("요청 본문의 형식과 숫자 입력값을 확인해주세요.");
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException exception) {
        return badRequest("회원 번호와 평점 번호는 양의 정수로 입력해주세요.");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException exception) {
        String constraint = constraintName(exception);
        if (constraint.contains("uk_member_email") || constraint.equals("email")) {
            return conflict("MEMBER4091", "이미 사용 중인 이메일입니다.");
        }
        if (constraint.contains("uk_member_nickname") || constraint.equals("nickname")) {
            return conflict("MEMBER4092", "이미 사용 중인 닉네임입니다.");
        }
        if (constraint.contains("uk_rating_member_movie")) {
            return conflict("RATING4091", "이미 이 영화에 평점을 남기셨습니다.");
        }
        return conflict("COMMON4091", "데이터를 저장할 수 없습니다. 중복 또는 참조 정보를 확인해주세요.");
    }

    private String constraintName(Throwable exception) {
        for (Throwable cause = exception; cause != null; cause = cause.getCause()) {
            if (cause instanceof ConstraintViolationException violation && violation.getConstraintName() != null) {
                return violation.getConstraintName().toLowerCase(Locale.ROOT)
                        .replace("`", "").replace("\"", "");
            }
        }
        return "";
    }

    private ResponseEntity<ApiResponse<Void>> badRequest(String message) {
        return ResponseEntity.badRequest().body(ApiResponse.failure("COMMON4001", message));
    }

    private ResponseEntity<ApiResponse<Void>> conflict(String code, String message) {
        return ResponseEntity.status(409).body(ApiResponse.failure(code, message));
    }
}
