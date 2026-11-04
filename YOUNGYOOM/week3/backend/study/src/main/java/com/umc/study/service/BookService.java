
package com.umc.study.service;

import com.umc.study.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


@Service //비즈니스 로직을 수행하는 메인 셰프?계층
@RequiredArgsConstructor
public class BookService {

    //레포지토리를 생성자 주입으로 데리고옴
    private final BookRepository bookRepository;

    public List<Map<String,Object>> getAllBooks(){
        //별다른 가공 없이 가져온 도서목록을 그대로 반환
        return bookRepository.findAll();
    }
    //클라이언트가 JSON Body 형태로 보낸 데이터를 @RequestBody를 통해 자바 Map 형태로 전달받음
    public void createBook(Map<String, Object> body) {
        bookRepository.save(body);
    }

    public List<Map<String, Object>> getBooksByCategory(Long categoryId) {
        return bookRepository.findByCategoryId(categoryId);
    }


}
