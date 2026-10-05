package com.umc._UMC.repository;

import com.umc._UMC.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findAllByOrderByBookIdDesc();
}