package com.umc.study.book.exception;

public class DuplicateBookTitleException extends RuntimeException {

    public DuplicateBookTitleException() {
        super("이미 등록된 도서 제목입니다.");
    }
}
