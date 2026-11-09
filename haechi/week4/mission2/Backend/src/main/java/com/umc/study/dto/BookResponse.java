package com.umc.study.dto;

import com.umc.study.entity.Book;

// 응답의 약속 - DB 컬럼명(book_id, is_available)이 아니라 API용 이름(camelCase)만 내보냄
public record BookResponse(
        Long bookId,
        String title,
        String description,
        String categoryName,
        Boolean isAvailable
) {
    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getBookId(),
                book.getTitle(),
                book.getDescription(),
                book.getCategory().getName(),
                book.getIsAvailable()
        );
    }
}
