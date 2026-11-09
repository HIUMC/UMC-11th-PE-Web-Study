package com.umc.study.service;

import com.umc.study.dto.BookResponse;
import com.umc.study.dto.CreateBookRequest;
import com.umc.study.entity.Book;
import com.umc.study.entity.Category;
import com.umc.study.exception.CategoryNotFoundException;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본은 읽기 전용, 저장하는 메서드만 따로 @Transactional
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public List<BookResponse> getBooks() {
        return toResponses(bookRepository.findAllByOrderByBookIdDesc());
    }

    public List<BookResponse> getBooksByCategory(Long categoryId) {
        return toResponses(bookRepository.findAllByCategory_CategoryIdOrderByBookIdDesc(categoryId));
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));

        Book book = new Book(category, request.title().strip(), request.description());
        return BookResponse.from(bookRepository.save(book));
    }

    private List<BookResponse> toResponses(List<Book> books) {
        return books.stream()
                .map(BookResponse::from)
                .toList();
    }
}
