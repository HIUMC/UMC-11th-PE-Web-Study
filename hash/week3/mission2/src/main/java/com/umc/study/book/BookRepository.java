package com.umc.study.book;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class BookRepository {

    private final JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> findAll() {
        String sql = """
                SELECT book_id, category_id, title, description, is_available
                FROM book
                ORDER BY book_id
                """;

        return jdbcTemplate.queryForList(sql);
    }

    public int save(Map<String, Object> body) {
        String sql = """
            INSERT INTO book (
                category_id, title, description, is_available
            )
            VALUES (?, ?, ?, TRUE)
            """;

        return jdbcTemplate.update(
                sql,
                body.get("categoryId"),
                body.get("title"),
                body.get("description")
        );
    }

    public List<Map<String, Object>> findByCategoryId(long categoryId) {
        String sql = """
            SELECT book_id, category_id, title, description, is_available
            FROM book
            WHERE category_id = ?
            ORDER BY book_id
            """;

        return jdbcTemplate.queryForList(sql, categoryId);
    }

    public boolean existsCategory(long categoryId) {
        String sql = "SELECT COUNT(*) FROM category WHERE category_id = ?";

        Integer count = jdbcTemplate.queryForObject(
                sql, Integer.class, categoryId
        );

        return count != null && count > 0;
    }
}