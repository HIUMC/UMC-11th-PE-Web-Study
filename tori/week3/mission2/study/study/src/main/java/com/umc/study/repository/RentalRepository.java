// src/main/java/.../repository/RentalRepository.java
package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public Long save(Map<String, Object> body) {
        // rented_at은 현재 시간, due_at은 7일 뒤로 자동 설정
        String sql = "INSERT INTO rental (user_id, book_id, rented_at, due_at) "
                + "VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setObject(1, body.get("userId"));
            ps.setObject(2, body.get("bookId"));
            return ps;
        }, keyHolder);

        // 생성된 rental_id 반환
        return keyHolder.getKey().longValue();
    }

    public Map<String, Object> findById(Long id) {
        String sql = "SELECT * FROM rental WHERE rental_id = ?";
        return jdbcTemplate.queryForMap(sql, id);
    }
}