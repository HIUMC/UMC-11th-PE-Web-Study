package com.umc.movie.exception;

import lombok.Getter;

@Getter
public class DuplicateException extends RuntimeException {
    private final DuplicateType type;

    public DuplicateException(DuplicateType type) {
        super(type.getMessage());
        this.type = type;
    }
}
