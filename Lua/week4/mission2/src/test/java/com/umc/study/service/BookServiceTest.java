package com.umc.study.service;

import com.umc.study.dto.BookResponse;
import com.umc.study.dto.CreateBookRequest;
import com.umc.study.entity.Book;
import com.umc.study.entity.Category;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class BookServiceTest {

    private final BookRepository bookRepository = mock(BookRepository.class);
    private final CategoryRepository categoryRepository = mock(CategoryRepository.class);
    private final BookService bookService = new BookService(bookRepository, categoryRepository);

    @Test
    void 최신_등록순_도서_목록을_응답_DTO로_반환한다() {
        Book book = mock(Book.class);
        Category category = mock(Category.class);
        when(book.getBookId()).thenReturn(2L);
        when(book.getTitle()).thenReturn("클린 코드");
        when(book.getDescription()).thenReturn("리팩터링 학습 도서");
        when(book.getCategory()).thenReturn(category);
        when(book.getIsAvailable()).thenReturn(true);
        when(category.getName()).thenReturn("IT");
        when(bookRepository.findAllByOrderByBookIdDesc()).thenReturn(List.of(book));

        List<BookResponse> result = bookService.getBooks();

        assertThat(result).containsExactly(
                new BookResponse(2L, "클린 코드", "리팩터링 학습 도서", "IT", true));
    }

    @Test
    void 존재하지_않는_카테고리로_도서를_등록하면_404를_반환한다() {
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.createBook(
                new CreateBookRequest(999L, "도서", null)))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    void 유효한_카테고리로_도서를_등록한다() {
        Category category = mock(Category.class);
        Book savedBook = mock(Book.class);
        when(category.getName()).thenReturn("소설");
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(bookRepository.save(any(Book.class))).thenReturn(savedBook);
        when(savedBook.getBookId()).thenReturn(3L);
        when(savedBook.getTitle()).thenReturn("데미안");
        when(savedBook.getDescription()).thenReturn("성장 소설");
        when(savedBook.getCategory()).thenReturn(category);
        when(savedBook.getIsAvailable()).thenReturn(true);

        BookResponse result = bookService.createBook(new CreateBookRequest(1L, "데미안", "성장 소설"));

        assertThat(result.bookId()).isEqualTo(3L);
        assertThat(result.categoryName()).isEqualTo("소설");
    }
}
