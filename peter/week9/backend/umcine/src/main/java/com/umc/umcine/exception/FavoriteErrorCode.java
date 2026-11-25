package com.umc.umcine.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum FavoriteErrorCode implements ErrorCode {
    NOT_FOUND(HttpStatus.NOT_FOUND, "FAVORITE404_1", "즐겨찾기한 영화를 찾을 수 없습니다."),
    DUPLICATE_FAVORITE(HttpStatus.CONFLICT, "FAVORITE409_1", "이미 이 영화를 즐겨찾기하셨습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
