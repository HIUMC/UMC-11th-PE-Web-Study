package com.umc.study.repository;

import com.umc.study.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    // 모든 책을 bookId 내림차순으로 조회
    List<Book> findAllByOrderByBookIdDesc();

    // 특정 카테고리에 속한 책 조회
    List<Book> findByCategory_CategoryId(Long categoryId);

    //조회 메서드
    List<Book> findByTitleContainingOrderByBookIdDesc(String keyword);
}