package com.umc.bookrental.rental;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public void save(Map<String, Object> body) {
        // rental_id는 AUTO_INCREMENT라 생략, returned_at은 NULL 허용이라 생략
        String sql = "INSERT INTO rental (user_id, book_id, rented_at, due_at) "
                   + "VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))";
        jdbcTemplate.update(sql, body.get("userId"), body.get("bookId"));
    }

    public int markReturned(Long rentalId) {
        // 이미 반납된 건 다시 덮어쓰지 않도록 returned_at IS NULL 조건 추가
        String sql = "UPDATE rental SET returned_at = NOW() "
                   + "WHERE rental_id = ? AND returned_at IS NULL";
        return jdbcTemplate.update(sql, rentalId);
    }
}
