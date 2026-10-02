// src/main/java/.../controller/BookController.java
package com.umc.dune_BE_study.controller;

import com.umc.dune_BE_study.dto.BookResponse;
import com.umc.dune_BE_study.dto.CreateBookRequest;

import com.umc.dune_BE_study.service.BookService;
/*
실행 흐름
요청: Client → Controller → Service → Repository
응답: Repository → Service → Controller → Client

의존성 방향
Controller → Service → Repository
 */

import com.umc.dune_BE_study.dto.BookResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

/*
==================== Week3 Raw SQL Repository ====================

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@RestController // 1. "나는 데이터를 JSON으로 서빙하는 API 카운터야!"
@RequestMapping("/books") // 2. 이 컨트롤러로 들어오는 요청의 기본 주소는 /books
@RequiredArgsConstructor
public class BookController {

    // 주방장(Service)을 주입받아 카운터 옆에 대기시킵니다.
    private final BookService bookService;

    // 3. HTTP GET 방식으로 /books 요청이 들어왔을 때 이 메서드가 실행됩니다.
    @GetMapping
    public List<Map<String, Object>> getBooks() {
        return bookService.getAllBooks();
    }

    @PostMapping
    public String createBook(@RequestBody Map<String, Object> body){
        bookService.createBook(body);
        return "도서 등록이 완료되었습니다!";
    }
}


=================================================================
*/

// Week4
@RestController //이 클래스가 HTTP API 요청을 받는 Controller라는 뜻
@RequiredArgsConstructor // Lombok이 final 필드를 받는 생성자를 자동 생성해 Spring이 BookService를 주입하게 함.
@RequestMapping("/books") // 이 컨트롤러 안에 있는 API들의 공통 주소 앞부분을 /books로 정한다
public class BookController {
    private final BookService bookService; // Controller가 Service를 호출하기 위해 가지고 있는 필드

    @GetMapping // GET 요청을 처리한다는 뜻. 여기선 GET /books 요청이 들어오면 아래 메서드를 실행
    public List<BookResponse> getBooks() { // Service에서 책 목록을 받아 클라이언트에게 반환
        return bookService.getBooks();
    }

    @PostMapping// HTTP POST 요청을 처리한다는 뜻. 여기선 // POST /books 요청을 처리
    @ResponseStatus(HttpStatus.CREATED) // 도서 등록 성공 시 HTTP 201 Created 반환
    public BookResponse createBook(
            @Valid @RequestBody CreateBookRequest request
            // @RequestBody: 요청 JSON을 CreateBookRequest DTO로 변환
            // @Valid: DTO에 붙여둔 NotNull, NotBlank같은 검증을 실제로 실행하라는 뜻.
            // => JSON을 DTO로 만들고, DTO의 검증 조건까지 확인하라는 뜻.
    ) {
        return bookService.createBook(request); // 검증된 요청 DTO를 Service에 전달하고 생성 결과를 반환
    }
}