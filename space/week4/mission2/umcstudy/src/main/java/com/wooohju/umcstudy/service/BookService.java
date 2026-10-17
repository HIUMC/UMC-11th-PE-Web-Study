package com.wooohju.umcstudy.service;

import com.wooohju.umcstudy.dto.BookResponse;
import com.wooohju.umcstudy.dto.CreateBookRequest;
import com.wooohju.umcstudy.entity.Book;
import com.wooohju.umcstudy.entity.Category;
import com.wooohju.umcstudy.entity.Rental;
import com.wooohju.umcstudy.repository.BookRepository;
import com.wooohju.umcstudy.repository.CategoryRepository;
import com.wooohju.umcstudy.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final RentalRepository rentalRepository;

    @Transactional(readOnly = true)
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAllByOrderByBookIdDesc().stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));

        Book book = new Book(category, request.title(), request.description());
        return BookResponse.from(bookRepository.save(book));
    }

    @Transactional
    public void rentBook(Long bookId, Map<String, Object> body) {
        Long userId = getUserId(body);
        Book book = getBook(bookId);

        if (!Boolean.TRUE.equals(book.getIsAvailable())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 대여 중인 도서입니다.");
        }

        rentalRepository.save(new Rental(userId, book));
        book.rent();
    }

    @Transactional
    public void returnBook(Long bookId) {
        Book book = getBook(bookId);
        Rental rental = rentalRepository.findByBookBookIdAndReturnedAtIsNull(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "반납할 대여 기록이 없습니다."));

        rental.returnBook();
        book.returnBook();
    }

    private Book getBook(Long bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 도서입니다."));
    }

    private Long getUserId(Map<String, Object> body) {
        return getLong(body, "userId");
    }

    private Long getLong(Map<String, Object> body, String fieldName) {
        Object value = body.get(fieldName);
        if (value == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + "는 필수입니다.");
        }

        if (value instanceof Number number) {
            return number.longValue();
        }

        try {
            return Long.parseLong(value.toString());
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + "는 숫자여야 합니다.");
        }
    }
}
