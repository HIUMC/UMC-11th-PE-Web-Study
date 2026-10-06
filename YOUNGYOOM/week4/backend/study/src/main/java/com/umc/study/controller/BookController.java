package com.umc.study.controller;

import com.umc.study.dto.BookResponse;
import com.umc.study.dto.CreateBookRequest;
import com.umc.study.service.BookService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@RestController //1. 나는 데이터를 JSON 으로 가져다주는 API 카운터임
@RequestMapping("/books")//2. 이 컨트롤러로 들어오는 요청의 기본 주소는 /books
@RequiredArgsConstructor
public class BookController {
    //Service를 주입받아 컨트롤러 옆에 대기
    private final BookService bookService;

    @GetMapping
    public List<BookResponse> getBooks(
            //keyword 없어도 요청 가능
            @RequestParam(required = false) String keyword
    ) {
        return bookService.getBooks(keyword);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponse createBook(
            @Valid @RequestBody CreateBookRequest request
            ) {
        return bookService.createBook(request);
    }
}


