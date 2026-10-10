// src/main/java/.../service/BookService.java
package com.umc.dune_BE_study.service;

import com.umc.dune_BE_study.domain.Book;
import com.umc.dune_BE_study.domain.Category;

import com.umc.dune_BE_study.dto.BookResponse;
import com.umc.dune_BE_study.dto.CreateBookRequest;

import com.umc.dune_BE_study.repository.BookRepository;
import com.umc.dune_BE_study.repository.CategoryRepository;
/*
실행 흐름
요청: Client → Controller → Service → Repository
응답: Repository → Service → Controller → Client

의존성 방향
Controller → Service → Repository
 */

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.umc.dune_BE_study.dto.BookResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/*
==================== Week3 Raw SQL Repository ====================
import java.util.Map;

@Service // 비즈니스 로직을 수행하는 메인 셰프 계층
@RequiredArgsConstructor
public class BookService {

    // 창고지기(Repository)를 생성자 주입으로 데려옵니다.
    private final BookRepository bookRepository;

    public List<Map<String, Object>> getAllBooks() {
        // 지금은 별도 가공 없이 창고지기가 가져온 도서 목록을 그대로 반환합니다.
        return bookRepository.findAll();
    }

    // BookService.java에 추가
    public void createBook(Map<String, Object> body){
        bookRepository.save(body);
    }
}

=================================================================
*/

// Week4
@Service // 이 클래스가 비즈니스 로직을 담당하는 Service 계층이라는 뜻
@RequiredArgsConstructor
/*
- Lombok이 final 필드에 대한 생성자를 자동으로 만들어줌.
  public BookService(BookRepository bookRepository) {
    this.bookRepository = bookRepository;
  } 이런 생성자를 만들어준다고 보면 됨.

- Spring은 이 생성자를 보고:
  BookService를 만들려면 BookRepository가 필요하구나.
  라고 판단해서 이미 만들어둔 BookRepository 객체를 넣어
*/
public class BookService {
    private final BookRepository bookRepository;
    // final: bookRepository에는 처음에 어떤 BookRepository 객체가 들어오고 나면, 그 뒤에 다른 객체로 갈아끼우지 않는다는 의미
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    // Transactional: DB 작업의 성공/실패를 하나의 단위(트랜잭션)로 관리하겠다. - 여기선 트랜잭션 안에서 실행되는 내용은 getBooks() 메서드 본문
    // Transactional 뒤에 있는 괄호: 트랜잭션의 옵션. readOnly = 이 트랜잭션은 읽기 전용으로 사용하겠다.
    public List<BookResponse> getBooks() { //List<BookResponse>를 반환
        return bookRepository.findAllByOrderByBookIdDesc()
                // .findAllByOrderByBookIdDesc(): DB에서 모든 Book을 bookId 내림차순으로 조회
                .stream()
                // .stream(): 리스트를 하나씩 처리할 수 있는 Stream 형태로 바꿈.
                .map(BookResponse::from)
                // 각 Book 엔티티를 클라이언트 응답용 BookResponse DTO로 변환 => 각각의 Book을 BookResponse로 바꿈.
                .toList();
                // 스트림 형태를 리스트로 모으기
    }

    @Transactional // 도서 등록 과정의 DB 작업을 하나의 트랜잭션으로 관리
    public BookResponse createBook(CreateBookRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                /*
                Category category : Category 객체를 담을 변수 category를 만든다.
                categoryRepository.findById() : categoryRepository파일의 findById()을 실행하라.
                findById() : JpaRepository가 기본 제공하는 메소드. PK 값을 이용해 엔티티 하나를 조회하는 메소드.
                 */
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));
                // .findById(request.categoryId())의 값이 있으면 꺼내서 반환하고, 없으면 예외를 발생시켜라.

        Book book = new Book(
                // 클라이언트 요청 DTO를 이용해, DB 저장에 사용할 Book Entity 생성
                // 검증된 요청 데이터를 사용해서 실제 Book Entity를 만든다.
                category,
                request.title(),
                request.description()
        );

        return BookResponse.from(bookRepository.save(book));
        // Book을 DB에 저장한 뒤, 저장된 결과를 응답용 DTO로 변환해 클라이언트에 반환함.
        // '실제로 저장된 결과가 이거다'를 응답하는 것임. 특히, 클라이언트는 모르는 book_id 같은 값들을 알려줄 수 있음.
    }
}