package com.umc.movie.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    INVALID_CREDENTIALS(401, "AUTH401_1", "이메일 또는 비밀번호가 올바르지 않습니다."),
    TOKEN_REQUIRED(401, "AUTH401_2", "로그인이 필요한 요청입니다."),
    TOKEN_INVALID(401, "AUTH401_3", "유효하지 않은 토큰입니다."),
    TOKEN_EXPIRED(401, "AUTH401_4", "토큰이 만료되었습니다. 다시 로그인해주세요."),
    DUPLICATE_EMAIL(409, "MEMBER4091", "이미 사용 중인 이메일입니다."),
    DUPLICATE_NICKNAME(409, "MEMBER4092", "이미 사용 중인 닉네임입니다."),
    PROFILE_NICKNAME_CONFLICT(409, "MEMBER409_1", "이미 사용 중인 닉네임입니다."),
    MEMBER_NOT_FOUND(404, "MEMBER404_1", "해당 회원을 찾을 수 없습니다."),
    DUPLICATE_RATING(409, "RATING409_1", "이미 이 영화에 평점을 남겼습니다."),
    RATING_NOT_FOUND(404, "RATING404_1", "해당 평점을 찾을 수 없습니다."),
    RATING_FORBIDDEN(403, "RATING403_1", "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다."),
    DATA_CONFLICT(409, "COMMON4091", "이미 존재하는 데이터입니다."),
    INTERNAL_ERROR(500, "COMMON5001", "서버에서 오류가 발생했습니다.");

    private final int status;
    private final String code;
    private final String message;
}