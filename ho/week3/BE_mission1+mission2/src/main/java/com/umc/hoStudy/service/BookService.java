package com.umc.hoStudy.service;

import com.umc.hoStudy.domain.Book;
import com.umc.hoStudy.dto.book.BookResponse;
import com.umc.hoStudy.dto.book.CreateBookRequest;
import com.umc.hoStudy.exception.CategoryNotFoundException;
import com.umc.hoStudy.repository.BookRepository;
import com.umc.hoStudy.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service // 비즈니스 로직을 수행하는 메인 셰프 계층
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {

    // 창고지기(Repository)를 생성자 주입으로 데려옵니다.
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public List<BookResponse> getBooks() {
        return bookRepository.findAllByOrderByBookIdDesc().stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        var category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));

        Book book = new Book(
                category,
                request.title(),
                request.description()
        );
        return BookResponse.from(bookRepository.save(book));
    }

    public List<BookResponse> getBooksByCategoryId(Long categoryId) {
        return bookRepository.findByCategory_CategoryId(categoryId).stream()
                .map(BookResponse::from)
                .toList();
    }
}
