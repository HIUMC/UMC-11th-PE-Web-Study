package com.umc.study.service;

import com.umc.study.domain.Book;
import com.umc.study.domain.Category;
import com.umc.study.dto.BookResponse;
import com.umc.study.dto.CreateBookRequest;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    // GET: 책 목록 조회
    @Transactional(readOnly = true)
    public List<BookResponse> getBooks(String keyword) {
        List<Book> books;

        if(keyword == null | keyword.isBlank()) {
            books = bookRepository.findAllByOrderByBookIdDesc();
        } else {
            books = bookRepository.findByTitleContainingOrderByBookIdDesc(
                    keyword.strip()
            );
        }
        return books.stream()
                .map(BookResponse::from)
                .toList();
    }

    // POST: 책 등록
    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "존재하지 않는 카테고리입니다."
                ));
        Book book = new Book(
                category,
                request.title(),
                request.description()
        );
        return BookResponse.from(bookRepository.save(book));
    }
}