package com.umc.bookrental.book;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class BookRepository {

    private final JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> findAll() {
        String sql = "SELECT * FROM book ORDER BY book_id DESC";
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> findByCategoryId(Long categoryId) {
        String sql = "SELECT * FROM book WHERE category_id = ?";
        return jdbcTemplate.queryForList(sql, categoryId);
    }

    public void save(Map<String, Object> body) {
        String sql = "INSERT INTO book (category_id, title, description, is_available) "
                   + "VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(
                sql,
                body.get("categoryId"),
                body.get("title"),
                body.get("description"),
                body.getOrDefault("isAvailable", true));
    }
}
