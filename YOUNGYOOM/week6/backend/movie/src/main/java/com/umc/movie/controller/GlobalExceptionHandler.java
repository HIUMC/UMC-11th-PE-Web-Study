// src/main/java/com/umc/movie/controller/GlobalExceptionHandler.java
package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.exception.DuplicateMemberException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

//여러 컨트롤러에서 발생한 예외를 한곳에서 처리하고,
//오류 응답 본문을 공통형식인 ApiResponse로 반환
@RestControllerAdvice
public class GlobalExceptionHandler {

    //@Vaild로 요청 DTO를 검사하다가 실패 시 HTTPf 400을 반환
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException exception) {
        //검증에 실패한 필드 중 첫번째 오류 메시지를 가져옴
        String message = exception.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(ApiResponse.failure("COMMON4001", message));
    }

    //DB제약 조건 위반시 HTTP409
    //예) 같은 이메일을 저장하다가 UNIQUE제약에 걸리는 경우 등
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException exception) {
        return ResponseEntity.status(409).body(ApiResponse.failure("COMMON4091", "이미 존재하는 데이터입니다."));
    }

    //서비스의 사전 중복 검사에서 던진 IllegalArgumentException을 HTTP409로 처리
    //서비스에서 지정한 메시지를 그대로 응답에 담음
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.status(409).body(ApiResponse.failure("COMMON4092", exception.getMessage()));
    }

    //서비스가 지정한 HTTP 상태와 공통 응답 형식에 담음
    //예를 들어 404예외가 들어오면 HTTP 상태는 404, 본문의 code는 COMMON404 가 됨
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(ResponseStatusException exception) {
        int status = exception.getStatusCode().value();
        return ResponseEntity.status(status)
                .body(ApiResponse.failure("COMMON" + status, exception.getReason()));
    }

    // 회원가입 중복 예외를 받으면 HTTP 409와 공통 오류 응답을 보냄
    // 어떤 항목이 중복됐는지는 서비스가 넘긴 코드와 메시지로 구분
    @ExceptionHandler(DuplicateMemberException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateMember(
            DuplicateMemberException exception
    ) {
        return ResponseEntity.status(409)
                .body(ApiResponse.failure(exception.getCode(), exception.getMessage()));
    }
}