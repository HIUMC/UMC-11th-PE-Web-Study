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

    // [미션 2] 대여 기록 생성
    // rented_at = 현재 시간, due_at = 7일 뒤, returned_at은 NULL 허용이라 생략
    public Long save(Map<String, Object> body) {
        String sql = "INSERT INTO rental (user_id, book_id, rented_at, due_at) "
                   + "VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))";

        // AUTO_INCREMENT로 생성된 rental_id를 돌려받기 위한 KeyHolder
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setObject(1, body.get("userId"));
            ps.setObject(2, body.get("bookId"));
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    // [선택 미션] 반납 처리 - 이미 반납된 기록은 덮어쓰지 않도록 returned_at IS NULL 조건 추가
    // 반환값: 영향받은 행 수 (0이면 없는 기록이거나 이미 반납됨)
    public int updateReturnedAt(Long rentalId) {
        String sql = "UPDATE rental SET returned_at = NOW() "
                   + "WHERE rental_id = ? AND returned_at IS NULL";
        return jdbcTemplate.update(sql, rentalId);
    }
}
