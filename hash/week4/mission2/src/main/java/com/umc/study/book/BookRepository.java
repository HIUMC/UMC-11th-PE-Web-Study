package com.umc.study.book;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    @EntityGraph(attributePaths = "category")
    List<Book> findAllByOrderByBookIdDesc();

    @EntityGraph(attributePaths = "category")
    List<Book> findByTitleContainingIgnoreCaseOrderByBookIdDesc(String keyword);

    boolean existsByTitle(String title);

    @EntityGraph(attributePaths = "category")
    List<Book> findByCategory_CategoryIdOrderByBookIdDesc(Long categoryId);
}
