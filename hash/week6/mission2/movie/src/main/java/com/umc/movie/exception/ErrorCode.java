package com.umc.movie.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    DUPLICATE_EMAIL(409, "MEMBER4091", "이미 사용 중인 이메일입니다."),
    DUPLICATE_NICKNAME(409, "MEMBER4092", "이미 사용 중인 닉네임입니다."),
    MEMBER_NOT_FOUND(404, "MEMBER4041", "존재하지 않는 회원입니다."),
    DUPLICATE_RATING(409, "RATING4091", "이미 이 영화에 평점을 남겼습니다."),
    RATING_NOT_FOUND(404, "RATING4041", "존재하지 않는 평점입니다."),
    RATING_FORBIDDEN(403, "RATING4031", "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다."),
    DATA_CONFLICT(409, "COMMON4091", "이미 존재하는 데이터입니다."),
    INTERNAL_ERROR(500, "COMMON5001", "서버에서 오류가 발생했습니다.");

    private final int status;
    private final String code;
    private final String message;
}