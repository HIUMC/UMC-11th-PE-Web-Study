package com.umc.umcine.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RatingErrorCode implements ErrorCode {
    NOT_FOUND(HttpStatus.NOT_FOUND, "RATING404_1", "해당 평점을 찾을 수 없습니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "RATING403_1", "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다."),
    DUPLICATE_RATING(HttpStatus.CONFLICT, "RATING409_1", "이미 이 영화에 평점을 남기셨습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
