package com.umc.study.book;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public List<Map<String, Object>> getBooks() {
        return bookService.getBooks();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBook(
            @RequestBody Map<String, Object> body
    ) {
        int affectedRows = bookService.createBook(body);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                        "message", "책이 등록되었습니다.",
                        "affectedRows", affectedRows
                )
        );
    }

    @GetMapping("/category/{categoryId}")
    public List<Map<String, Object>> getBooksByCategory(
            @PathVariable("categoryId") long categoryId
    ) {
        return bookService.getBooksByCategory(categoryId);
    }
}