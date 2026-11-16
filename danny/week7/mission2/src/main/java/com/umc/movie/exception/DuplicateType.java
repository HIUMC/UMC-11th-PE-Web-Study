package com.umc.movie.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

// 사전 중복 체크와 DB UNIQUE 제약 위반이 같은 code와 message로 응답하도록 한 곳에 모읍니다.
@Getter
@RequiredArgsConstructor
public enum DuplicateType {
    EMAIL("MEMBER4091", "이미 사용 중인 이메일입니다."),
    NICKNAME("MEMBER4092", "이미 사용 중인 닉네임입니다."),
    RATING("RATING4091", "이미 이 영화에 평점을 남기셨습니다.");

    private final String code;
    private final String message;
}
