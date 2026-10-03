package com.example.mission2.repository;

import com.example.mission2.dto.RentalResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Statement;

@Repository
public class RentalRepository {
    private final JdbcTemplate jdbcTemplate;

    public RentalRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Long insert(Long userId, Long bookId) {
        String sql = """
                INSERT INTO rental (user_id, book_id, rented_at, due_at)
                VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
                """;
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            var statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setLong(1, userId);
            statement.setLong(2, bookId);
            return statement;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key == null) throw new IllegalStateException("대여 ID를 생성하지 못했습니다.");
        return key.longValue();
    }

    public RentalResponse findById(Long rentalId) {
        String sql = """
                SELECT rental_id, user_id, book_id, rented_at, due_at, returned_at
                FROM rental WHERE rental_id = ?
                """;
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> new RentalResponse(
                rs.getLong("rental_id"), rs.getLong("user_id"), rs.getLong("book_id"),
                rs.getTimestamp("rented_at").toLocalDateTime(),
                rs.getTimestamp("due_at").toLocalDateTime(),
                rs.getTimestamp("returned_at") == null ? null : rs.getTimestamp("returned_at").toLocalDateTime()), rentalId);
    }
}

