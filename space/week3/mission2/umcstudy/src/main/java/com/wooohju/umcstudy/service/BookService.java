package com.wooohju.umcstudy.service;

import com.wooohju.umcstudy.repository.BookRepository;
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

    public List<Map<String, Object>> getAllBooks() {
        return bookRepository.findAll();
    }

    public void createBook(Map<String, Object> body) {
        bookRepository.save(body);
    }

    @Transactional
    public void rentBook(Long bookId, Map<String, Object> body) {
        Long userId = getUserId(body);

        if (!bookRepository.existsById(bookId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 도서입니다.");
        }

        if (!bookRepository.isAvailable(bookId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 대여 중인 도서입니다.");
        }

        bookRepository.saveRental(userId, bookId);
        bookRepository.updateAvailability(bookId, false);
    }

    @Transactional
    public void returnBook(Long bookId) {
        if (!bookRepository.existsById(bookId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 도서입니다.");
        }

        int updatedCount = bookRepository.returnActiveRental(bookId);
        if (updatedCount == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "반납할 대여 기록이 없습니다.");
        }

        bookRepository.updateAvailability(bookId, true);
    }

    private Long getUserId(Map<String, Object> body) {
        Object userId = body.get("userId");
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId는 필수입니다.");
        }

        if (userId instanceof Number number) {
            return number.longValue();
        }

        try {
            return Long.parseLong(userId.toString());
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId는 숫자여야 합니다.");
        }
    }
}
