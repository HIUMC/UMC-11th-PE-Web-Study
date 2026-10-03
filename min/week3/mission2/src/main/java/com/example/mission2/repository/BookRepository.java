package com.example.mission2.repository;

import com.example.mission2.dto.BookResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BookRepository {
    private final JdbcTemplate jdbcTemplate;

    public BookRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<BookResponse> findByCategoryId(Long categoryId) {
        String sql = """
                SELECT book_id, category_id, title, description, is_available
                FROM book
                WHERE category_id = ?
                """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> new BookResponse(
                rs.getLong("book_id"), rs.getLong("category_id"), rs.getString("title"),
                rs.getString("description"), rs.getBoolean("is_available")), categoryId);
    }
}

