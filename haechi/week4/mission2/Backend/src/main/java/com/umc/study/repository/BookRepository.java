package com.umc.study.repository;

import com.umc.study.entity.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// SQL 문자열 없이 메서드 이름으로 쿼리를 표현 (save, findById 등은 JpaRepository가 제공)
public interface BookRepository extends JpaRepository<Book, Long> {

    // [실습 1] GET /books - 전체 도서 최신순(book_id 내림차순)
    // @EntityGraph: category를 JOIN으로 한 번에 가져옴 → 책 N권마다 카테고리를 따로 조회하는 N+1 방지
    @EntityGraph(attributePaths = "category")
    List<Book> findAllByOrderByBookIdDesc();

    // [3주차 미션 1 → JPA] GET /books/category/{categoryId}
    // category 객체의 categoryId 필드로 조건 (Category_CategoryId)
    @EntityGraph(attributePaths = "category")
    List<Book> findByCategory_CategoryIdOrderByBookIdDesc(Long categoryId);
}
