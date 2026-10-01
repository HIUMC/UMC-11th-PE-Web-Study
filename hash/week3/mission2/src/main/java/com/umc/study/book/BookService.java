package com.umc.study.book;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public List<Map<String, Object>> getBooks() {
        return bookRepository.findAll();
    }

    public List<Map<String, Object>> getBooksByCategory(long categoryId) {
        if (categoryId <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "categoryId는 양의 정수여야 합니다."
            );
        }

        return bookRepository.findByCategoryId(categoryId);
    }

    public int createBook(Map<String, Object> body) {
        Object categoryId = body.get("categoryId");
        Object title = body.get("title");
        Object description = body.get("description");

        if (!(categoryId instanceof Integer || categoryId instanceof Long)
                || ((Number) categoryId).longValue() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "categoryId는 양의 정수여야 합니다."
            );
        }

        if (!(title instanceof String text)
                || text.isBlank()
                || text.length() > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "title은 공백이 아닌 1~100자의 문자열이어야 합니다."
            );
        }

        if (description != null && !(description instanceof String)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "description은 문자열이어야 합니다."
            );
        }

        if (!bookRepository.existsCategory(
                ((Number) categoryId).longValue()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "존재하지 않는 카테고리입니다."
            );
        }

        return bookRepository.save(body);
    }
}