//RentalRespository.java
package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository // 스프링 컨테이너에 DB 부품으로 등록
@RequiredArgsConstructor

public class RentalRepository {
    private final JdbcTemplate jdbcTemplate;

    public void save(Map<String, Object> body) {
        //rental_id제외, returned_at은 NULL 허용이고 자동으로 NULL 이 들어가기 때문에 제외
        String sql = "INSERT INTO rental(user_id, book_id, rented_at, due_at)"
                + "VALUES(?,?,NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))";
        jdbcTemplate.update(sql, body.get("userId"), body.get("bookId"));
    }

    public int updateReturnedAt(Long rentalId) {
        String sql = "UPDATE rental SET returned_at = NOW() WHERE rental_id = ?";
        return jdbcTemplate.update(sql, rentalId);
    };

}
