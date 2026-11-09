package com.wooohju.umcstudy.repository;

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
        String sql = "SELECT * FROM book";
        return jdbcTemplate.queryForList(sql);
    }

    public void save(Map<String, Object> body) {
        String sql = "INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)";

        jdbcTemplate.update(
                sql,
                body.get("categoryId"),
                body.get("title"),
                body.get("description")
        );
    }

    public boolean existsById(Long bookId) {
        String sql = "SELECT COUNT(*) FROM book WHERE book_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, bookId);
        return count != null && count > 0;
    }

    public boolean isAvailable(Long bookId) {
        String sql = "SELECT COUNT(*) FROM book WHERE book_id = ? AND is_available = true";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, bookId);
        return count != null && count > 0;
    }

    public void saveRental(Long userId, Long bookId) {
        String sql = """
                INSERT INTO rental (user_id, book_id, rented_at, due_at)
                VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY))
                """;

        jdbcTemplate.update(sql, userId, bookId);
    }

    public int returnActiveRental(Long bookId) {
        String sql = """
                UPDATE rental
                SET returned_at = NOW()
                WHERE book_id = ?
                  AND returned_at IS NULL
                """;

        return jdbcTemplate.update(sql, bookId);
    }

    public void updateAvailability(Long bookId, boolean isAvailable) {
        String sql = "UPDATE book SET is_available = ? WHERE book_id = ?";
        jdbcTemplate.update(sql, isAvailable, bookId);
    }
}
