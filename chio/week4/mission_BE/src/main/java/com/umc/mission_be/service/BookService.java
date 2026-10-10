package com.umc.mission_be.service;

import com.umc.mission_be.repository.BookRepository;
import com.umc.mission_be.repository.CategoryRepository;
import com.umc.mission_be.dto.CreateBookRequest;
import com.umc.mission_be.entity.Book;
import com.umc.mission_be.entity.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.umc.mission_be.dto.BookResponse;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service // 비즈니스 로직을 수행하는 메인 셰프 계층
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<BookResponse> getBooks() {
        return bookRepository.findAllByOrderByBookIdDesc().stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "존재하지 않는 카테고리입니다."
                ));

        Book book = new Book(category, request.title(), request.description());
        return BookResponse.from(bookRepository.save(book));
    }
}
