package com.umc.study.controller;

import com.umc.study.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


import java.util.List;
import java.util.Map;

@RestController //1. 나는 데이터를 JSON 으로 가져다주는 API 카운터임
@RequestMapping("/books")//2. 이 컨트롤러로 들어오는 요청의 기본 주소는 /books
@RequiredArgsConstructor
public class BookController {
    //Service를 주입받아 컨트롤러 옆에 대기
    private final BookService bookService;

    //3. HTTP GET 방식으로 /books 요청이 들어왔을 때 이 메서드가 실행됨
    @GetMapping
    public List<Map<String, Object>> getBooks() {
        return bookService.getAllBooks();
    }

    @PostMapping
    public String createBook(@RequestBody Map<String, Object> body) {
        bookService.createBook(body);
        return "도서 등록이 완료되었습니다.";
    }

    @GetMapping("/category/{categoryId}")
    public List<Map<String, Object>> getBooksByCategory(@PathVariable("categoryId") Long categoryId) {
        return bookService.getBooksByCategory(categoryId);
    }
}


