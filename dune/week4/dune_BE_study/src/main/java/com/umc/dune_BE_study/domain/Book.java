package com.umc.dune_BE_study.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity // 이 클래스는 DB와 연결되는 클래스다.
@Table(name = "book") // 이 DB의 book 테이블과 연결해라.
@Getter //Lombok 기능(bookId, title등의 getter를 다 일일이 작성할 필요 없게 해주는 기능)
@NoArgsConstructor(access = AccessLevel.PROTECTED) //매개변수 없는 생성자를 자동으로 만든다.
public class Book {

    @Id //해당 필드가 객체의 기본키(Primary Key, PK)임을 나타내는 식별자 역할
    @GeneratedValue(strategy = GenerationType.IDENTITY) //MySQL의 AUTO_INCREMENT를 사용한다
    @Column(name = "book_id") // '테이블의 어떤 필드'랑 'Java 클래스의 어떤 요소'랑 연결되는지 알려줌.
    private Long bookId;

    @ManyToOne(fetch = FetchType.LAZY) //여러 Book이 하나의 Category에 속한다.
    @JoinColumn(name = "category_id", nullable = false) //Book과 Category를 연결할 때 book 테이블의 category_id FK를 사용한다.
    private Category category; // Category 객체 자체를 가져올 수 있음.(=> 객체끼리 관게를 표현하는 것이 가능해짐)

    @Column(nullable = false, length = 100) // Java 필드명과 DB 컬럼명이 같으면 @Column의 name 속성(name = ...)은 생략 가능
    private String title;

    @Column(columnDefinition = "TEXT") // DB의 description 컬럼 타입이 TEXT임을 JPA에 명시
    private String description; // java에는 TEXT, VARCHAR등의 타입이 없어서 string으로 지정함.

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    public Book(Category category, String title, String description) { // 새로운 책을 만들 때 사용할 생성자
        this.category = category;
        this.title = title;
        this.description = description;
    }
}