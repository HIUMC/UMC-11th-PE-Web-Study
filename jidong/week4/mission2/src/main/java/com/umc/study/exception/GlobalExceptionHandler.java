package com.umc.study.exception;

import com.umc.study.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice // 모든 컨트롤러에서 발생한 예외를 여기서 처리
public class GlobalExceptionHandler {

    // @Valid 검증 실패: 빈 제목, categoryId 누락 등 → 400
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> fieldErrors.putIfAbsent(error.getField(), error.getDefaultMessage()));

        return new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "요청 값이 올바르지 않습니다.", fieldErrors);
    }

    // JSON 형식 오류, categoryId에 문자열 전달 등 → 400
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleNotReadable(HttpMessageNotReadableException exception) {
        return ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), "요청 본문을 읽을 수 없습니다. JSON 형식을 확인해 주세요.");
    }

    // 존재하지 않는 categoryId → 404
    @ExceptionHandler(CategoryNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleCategoryNotFound(CategoryNotFoundException exception) {
        return ErrorResponse.of(HttpStatus.NOT_FOUND.value(), exception.getMessage());
    }
}
