package com.umc.study.rental;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.sql.PreparedStatement;
import java.sql.Statement;

@Repository
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public boolean existsUser(long userId) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE user_id = ?",
                Integer.class,
                userId
        );

        return count != null && count > 0;
    }

    public boolean existsBook(long bookId) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM book WHERE book_id = ?",
                Integer.class,
                bookId
        );

        return count != null && count > 0;
    }

    public int markBookAsRented(long bookId) {
        String sql = """
                UPDATE book
                SET is_available = FALSE
                WHERE book_id = ? AND is_available = TRUE
                """;

        return jdbcTemplate.update(sql, bookId);
    }

    public long save(long userId, long bookId) {
        String sql = """
                INSERT INTO rental (
                    user_id, book_id, rented_at, due_at
                )
                VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(
                    sql, Statement.RETURN_GENERATED_KEYS
            );

            statement.setLong(1, userId);
            statement.setLong(2, bookId);

            return statement;
        }, keyHolder);

        Number generatedId = keyHolder.getKey();

        if (generatedId == null) {
            throw new IllegalStateException("대여 ID를 가져오지 못했습니다.");
        }

        return generatedId.longValue();
    }

    public Long findBookIdByRentalId(long rentalId) {
        List<Long> bookIds = jdbcTemplate.queryForList(
                "SELECT book_id FROM rental WHERE rental_id = ?",
                Long.class,
                rentalId
        );

        return bookIds.isEmpty() ? null : bookIds.getFirst();
    }

    public int markAsReturned(long rentalId) {
        String sql = """
            UPDATE rental
            SET returned_at = NOW()
            WHERE rental_id = ? AND returned_at IS NULL
            """;

        return jdbcTemplate.update(sql, rentalId);
    }

    public int markBookAsAvailable(long bookId) {
        String sql = """
            UPDATE book
            SET is_available = TRUE
            WHERE book_id = ?
            """;

        return jdbcTemplate.update(sql, bookId);
    }
}