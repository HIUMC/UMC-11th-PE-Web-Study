package com.umc.study.book;

import com.umc.study.book.dto.BookResponse;
import com.umc.study.book.dto.CreateBookRequest;
import com.umc.study.book.exception.DuplicateBookTitleException;
import com.umc.study.category.Category;
import com.umc.study.category.CategoryRepository;
import com.umc.study.category.exception.CategoryNotFoundException;
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

    public List<BookResponse> getBooks(String keyword) {
        List<Book> books = keyword == null || keyword.isBlank()
                ? bookRepository.findAllByOrderByBookIdDesc()
                : bookRepository.findByTitleContainingIgnoreCaseOrderByBookIdDesc(
                        keyword.strip()
                );

        return books.stream()
                .map(BookResponse::from)
                .toList();
    }

    public List<BookResponse> getBooksByCategory(long categoryId) {
        return bookRepository
                .findByCategory_CategoryIdOrderByBookIdDesc(categoryId)
                .stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));

        if (bookRepository.existsByTitle(request.title())) {
            throw new DuplicateBookTitleException();
        }

        Book book = Book.create(
                category,
                request.title(),
                request.description()
        );

        Book savedBook = bookRepository.saveAndFlush(book);

        return BookResponse.from(savedBook);
    }
}
