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
@Transactional(readOnly = true) // 기본은 읽기 전용, 쓰기 메서드만 @Transactional로 덮어씀
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    // [실습 1] 전체 도서 최신순 - 엔티티를 그대로 내보내지 않고 DTO로 변환
    public List<BookResponse> getBooks() {
        return bookRepository.findAllByOrderByBookIdDesc().stream()
                .map(BookResponse::from)
                .toList();
    }

    // [실습 2] 신규 도서 등록
    // 1) 카테고리가 실제로 있는지 확인 (없으면 404) → 2) 엔티티 생성 → 3) 저장 → 4) DTO 변환
    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));

        Book book = new Book(category, request.title(), request.description());
        return BookResponse.from(bookRepository.save(book));
    }

    // [3주차 미션 1 → JPA] 카테고리별 도서 목록
    public List<BookResponse> getBooksByCategory(Long categoryId) {
        return bookRepository.findByCategory_CategoryIdOrderByBookIdDesc(categoryId).stream()
                .map(BookResponse::from)
                .toList();
    }
}
