package com.umc.study.book;

import com.umc.study.book.dto.BookResponse;
import com.umc.study.book.dto.CreateBookRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public List<BookResponse> getBooks(
            @RequestParam(name = "keyword", required = false)
            @Size(max = 100, message = "검색어는 100자 이하여야 합니다.")
            String keyword
    ) {
        return bookService.getBooks(keyword);
    }

    @PostMapping
    public ResponseEntity<BookResponse> createBook(
            @Valid @RequestBody CreateBookRequest request
    ) {
        BookResponse response = bookService.createBook(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/category/{categoryId}")
    public List<BookResponse> getBooksByCategory(
            @PathVariable("categoryId")
            @Positive(message = "categoryId는 양의 정수여야 합니다.")
            long categoryId
    ) {
        return bookService.getBooksByCategory(categoryId);
    }
}
