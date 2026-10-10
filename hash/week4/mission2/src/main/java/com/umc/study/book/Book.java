package com.umc.study.book;

import com.umc.study.category.Category;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "book", uniqueConstraints =
        @UniqueConstraint(name = Book.TITLE_UNIQUE_CONSTRAINT, columnNames = "title"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Book {

    public static final String TITLE_UNIQUE_CONSTRAINT = "uk_book_title";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Long bookId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    private Book(Category category, String title, String description) {
        this.category = category;
        this.title = title;
        this.description = description;
    }

    public static Book create(Category category, String title, String description) {
        if (category == null) {
            throw new IllegalArgumentException("카테고리는 필수입니다.");
        }
        if (title == null || title.isBlank() || title.length() > 100) {
            throw new IllegalArgumentException("제목은 공백이 아닌 1~100자여야 합니다.");
        }

        return new Book(category, title, description);
    }
}
