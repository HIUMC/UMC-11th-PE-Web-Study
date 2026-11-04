package com.umc.movie.exception;

//회원가입이 중복으로 실패했을 때 응답에 쓸 코드와 메시지 전달
public class DuplicateMemberException extends RuntimeException {
    private final String code;

    public DuplicateMemberException(String code, String message) {
        //메시지는 부모 예외에 저장함 -> 처리기에서 getMessage()로 꺼낼 수 있음
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
