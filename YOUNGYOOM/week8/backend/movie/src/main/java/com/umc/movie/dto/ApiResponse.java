package com.umc.movie.dto;

// 응답 메시지와 데이터를 함께 담는 공통 응답 DTO
public record ApiResponse<T>(boolean isSuccess, String code, String message, T result) {

    // 회원가입처럼 새 데이터를 생성했을 때 사용하는 성공 응답 본문
    //실제 HTTP 상태 코드 201은 컨트롤러에서 설정
    public static <T> ApiResponse<T> created(String message, T result) {
        return new ApiResponse<>(true, "COMMON201", message, result);
    }

    //조회/수정에 성공했을 때 사용하는 성공 응답 본문
    public static <T> ApiResponse<T> ok(String message, T result) {
        return new ApiResponse<>(true, "COMMON200", message, result);
    }

    //실패 응답에는 오류 코드와 메시지를 담고, 결과 데이터는 null
    public static ApiResponse<Void> failure(String code, String message) {
        return new ApiResponse<>(false, code, message, null);
    }
}