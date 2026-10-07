package com.umc.backend.dto;

import com.umc.backend.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BookResponse {
    private Long bookId;
    private String title;
    private String description;
    private String categoryName;
    // 래퍼 타입: Lombok getter가 getIsAvailable()이 되어 JSON 키가 "isAvailable"로 직렬화됨
    private Boolean isAvailable;

    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getDescription(),
                book.getCategory().getName(),
                book.isAvailable()
        );
    }
}