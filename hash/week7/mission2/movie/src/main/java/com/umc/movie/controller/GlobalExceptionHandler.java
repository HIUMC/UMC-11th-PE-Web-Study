package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.exception.BusinessException;
import com.umc.movie.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.sql.SQLException;
import java.util.Locale;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusiness(
            BusinessException exception
    ) {
        return failure(exception.getErrorCode());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(
            DataIntegrityViolationException exception, HttpServletRequest request
    ) {
        ErrorCode error = resolveConstraint(exception);

        if (error == ErrorCode.DUPLICATE_NICKNAME
                && HttpMethod.PATCH.matches(request.getMethod())
                && request.getRequestURI().equals(request.getContextPath() + "/members/me")) {
            error = ErrorCode.PROFILE_NICKNAME_CONFLICT;
        }

        if (error != null) {
            log.warn("DB 제약 위반 처리: code={}", error.getCode());
            return failure(error);
        }

        log.error("예상하지 못한 DB 무결성 오류", exception);
        return failure(ErrorCode.INTERNAL_ERROR);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception exception,
            @Nullable Object body,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        String message = "요청을 처리할 수 없습니다.";

        if (exception instanceof MethodArgumentNotValidException validation) {
            message = validation.getBindingResult().getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .filter(value -> value != null)
                    .findFirst()
                    .orElse("입력값을 확인해주세요.");

        } else if (exception instanceof HandlerMethodValidationException validation) {
            message = validation.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .filter(value -> value != null)
                    .findFirst()
                    .orElse("입력값을 확인해주세요.");

        } else if (status.value() == 400) {
            message = "요청 형식이나 입력값이 올바르지 않습니다.";
        }

        return new ResponseEntity<>(
                ApiResponse.failure(
                        "COMMON" + status.value() + "1",
                        message
                ),
                headers,
                status
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleUnexpected(
            Exception exception
    ) {
        log.error("예상하지 못한 서버 오류", exception);
        return failure(ErrorCode.INTERNAL_ERROR);
    }

    private ErrorCode resolveConstraint(Throwable exception) {
        for (
                Throwable cause = exception;
                cause != null;
                cause = cause.getCause()
        ) {
            if (cause instanceof ConstraintViolationException violation) {
                String name = violation.getConstraintName();

                if (name != null) {
                    name = name.toLowerCase(Locale.ROOT);

                    if (name.contains("uk_member_email")) {
                        return ErrorCode.DUPLICATE_EMAIL;
                    }
                    if (name.contains("uk_member_nickname")) {
                        return ErrorCode.DUPLICATE_NICKNAME;
                    }
                    if (name.contains("uk_rating_member_movie")) {
                        return ErrorCode.DUPLICATE_RATING;
                    }
                    if (name.contains("fk_rating_member")) {
                        return ErrorCode.MEMBER_NOT_FOUND;
                    }
                }
            }

            if (
                    cause instanceof SQLException sql
                            && sql.getErrorCode() == 1062
            ) {
                return ErrorCode.DATA_CONFLICT;
            }
        }

        return null;
    }

    private ResponseEntity<ApiResponse<Void>> failure(ErrorCode error) {
        ResponseEntity.BodyBuilder response = ResponseEntity.status(error.getStatus());

        if (error == ErrorCode.TOKEN_REQUIRED) {
            response.header(HttpHeaders.WWW_AUTHENTICATE, "Bearer");
        } else if (error == ErrorCode.TOKEN_INVALID || error == ErrorCode.TOKEN_EXPIRED) {
            response.header(HttpHeaders.WWW_AUTHENTICATE, "Bearer error=\"invalid_token\"");
        }

        return response.body(ApiResponse.failure(error.getCode(), error.getMessage()));
    }
}