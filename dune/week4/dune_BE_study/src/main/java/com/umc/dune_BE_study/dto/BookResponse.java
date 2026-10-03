package com.umc.dune_BE_study.dto;

import com.umc.dune_BE_study.domain.Book;

public record BookResponse(
        Long bookId,
        String title,
        String description,
        String categoryName,
        Boolean isAvailable
) {
    public static BookResponse from(Book book) { // Book Entity 하나를 받아서 BookResponse DTO 하나로 변환한다.
        return new BookResponse(
                book.getBookId(),
                book.getTitle(),
                book.getDescription(),
                book.getCategory().getName(), //Category 객체의 name 필드를 가져온다.
                book.getIsAvailable()
        );
    }
}