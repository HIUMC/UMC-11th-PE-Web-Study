package com.umc.week5.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * 서비스에서 발생하는 모든 실패를 한 곳에 모아 둡니다.
 * 응답은 항상 { isSuccess:false, code, message, result:null } 형태로 나갑니다.
 */
@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // 공통
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "COMMON400", "잘못된 요청입니다."),
    DUPLICATE_DATA(HttpStatus.CONFLICT, "COMMON409", "이미 존재하는 데이터입니다."),

    // 회원
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "MEMBER404", "존재하지 않는 유저입니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "MEMBER4091", "이미 사용 중인 이메일입니다."),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "MEMBER4092", "이미 사용 중인 닉네임입니다."),

    // 평점
    RATING_NOT_FOUND(HttpStatus.NOT_FOUND, "RATING404", "존재하지 않는 평점입니다."),
    RATING_FORBIDDEN(HttpStatus.FORBIDDEN, "RATING403", "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다."),
    DUPLICATE_RATING(HttpStatus.CONFLICT, "RATING409", "이미 이 영화에 평점을 남기셨습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
