package com.umc.study.service;

import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    public Long createRental(Map<String, Object> body) {
        return rentalRepository.save(body);
    }

    // 비즈니스 규칙: 반납할 대여 기록이 없으면(없는 id 또는 이미 반납) 404
    public void returnRental(Long rentalId) {
        int updated = rentalRepository.updateReturnedAt(rentalId);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "반납할 대여 기록이 없습니다.");
        }
    }
}
