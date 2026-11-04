package com.umc.backend.service;

import com.umc.backend.dto.BookCreateRequest;
import com.umc.backend.dto.BookResponse;
import com.umc.backend.entity.Book;
import com.umc.backend.entity.Category;
import com.umc.backend.exception.CategoryNotFoundException;
import com.umc.backend.repository.BookRepository;
import com.umc.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public List<BookResponse> getAllBooks() {
        return bookRepository.findAllWithCategory().stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional
    public BookResponse createBook(BookCreateRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.getCategoryId()));

        Book book = Book.builder()
                .category(category)
                .title(request.getTitle())
                .description(request.getDescription())
                .build();

        Book savedBook = bookRepository.save(book);
        return BookResponse.from(savedBook);
    }
}