package com.example.mission2.service;

import com.example.mission2.dto.BookResponse;
import com.example.mission2.dto.CreateBookRequest;
import com.example.mission2.entity.Book;
import com.example.mission2.repository.BookRepository;
import com.example.mission2.repository.CategoryRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<BookResponse> getBooks() {
        return bookRepository.findAllByOrderByBookIdDesc().stream().map(BookResponse::from).toList();
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        Long categoryId = Objects.requireNonNull(request.categoryId());
        var category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));
        return BookResponse.from(bookRepository.save(new Book(category, request.title(), request.description())));
    }
}
