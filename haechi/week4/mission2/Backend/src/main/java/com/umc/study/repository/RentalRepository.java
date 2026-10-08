package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Map;

// 3주차 Raw SQL 코드 그대로 유지 (4주차 미션 범위는 Book API)
@Repository
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    // [3주차 미션 2] 대여 기록 생성
    public Long save(Map<String, Object> body) {
        String sql = "INSERT INTO rental (user_id, book_id, rented_at, due_at) "
                   + "VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setObject(1, body.get("userId"));
            ps.setObject(2, body.get("bookId"));
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    // [3주차 선택 미션] 반납 처리
    public int updateReturnedAt(Long rentalId) {
        String sql = "UPDATE rental SET returned_at = NOW() "
                   + "WHERE rental_id = ? AND returned_at IS NULL";
        return jdbcTemplate.update(sql, rentalId);
    }
}
