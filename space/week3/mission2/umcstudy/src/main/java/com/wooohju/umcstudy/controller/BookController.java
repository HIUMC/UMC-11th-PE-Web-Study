package com.wooohju.umcstudy.controller;

import com.wooohju.umcstudy.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public List<Map<String, Object>> getBooks() {
        return bookService.getAllBooks();
    }

    @PostMapping
    public String createBook(@RequestBody Map<String, Object> body) {
        bookService.createBook(body);
        return "도서 등록이 완료되었습니다.";
    }

    @PostMapping("/{bookId}/rent")
    public String rentBook(@PathVariable Long bookId, @RequestBody Map<String, Object> body) {
        bookService.rentBook(bookId, body);
        return "도서 대여가 완료되었습니다.";
    }

    @PatchMapping("/{bookId}/return")
    public String returnBook(@PathVariable Long bookId) {
        bookService.returnBook(bookId);
        return "도서 반납이 완료되었습니다.";
    }
}
