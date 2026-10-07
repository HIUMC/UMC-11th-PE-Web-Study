package com.umc.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "book")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    private String title;

    private String description;

    @Column(name = "is_available")
    private boolean isAvailable;

    @Builder
    public Book(Category category, String title, String description) {
        this.category = category;
        this.title = title;
        this.description = description;
        this.isAvailable = true; // 기본값 true
    }
}