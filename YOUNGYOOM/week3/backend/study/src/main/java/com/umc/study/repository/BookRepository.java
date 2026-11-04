package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository // 스프링 컨테이너에 DB 부품으로 등록
@RequiredArgsConstructor
public class BookRepository {
    // 스프링의 DB 통신 도구 주입
    private final JdbcTemplate jdbcTemplate;

    // 쿼리 실행 후 결과를 List<Map> 형태로 가져옴
    // Map의 key는 컬럼명(title), value는 실제 데이터(달빛 도서관)
    public List<Map<String, Object>> findAll() {
        String sql = "SELECT * FROM book";
        return jdbcTemplate.queryForList(sql);
    }

    public void save(Map<String, Object> body) {
        //book_id는 AUTO_INCREMENT 임 -> 생략,
        //is_available 은 기본 true임 -> 삽입
        String sql = "INSERT INTO book(category_id, title, description, is_available) VALUES(?,?,?,true)";

        //SQL 뒤에 파라미터를 차례대로 넘겨주면 -> ? 자리에 순서대로 바인딩
        jdbcTemplate.update(sql,body.get("category_id"), body.get("title"), body.get("description"));
    }

    public List<Map<String, Object>> findByCategoryId(Long categoryId) {
        String sql = "SELECT* FROM book WHERE category_id = ?";
        return jdbcTemplate.queryForList(sql, categoryId);
    }




}