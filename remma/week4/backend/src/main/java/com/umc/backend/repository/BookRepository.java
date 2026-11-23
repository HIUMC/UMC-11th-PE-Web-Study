package com.umc.backend.repository;
import com.umc.backend.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    // category를 fetch join으로 한 번에 조회 (N+1 방지), 최신 등록순(book_id DESC)
    @Query("SELECT b FROM Book b JOIN FETCH b.category ORDER BY b.id DESC")
    List<Book> findAllWithCategory();
}