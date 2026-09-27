// src/main/java/.../service/RentalService.java
package com.umc.study.service;

import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    public Map<String, Object> createRental(Map<String, Object> body) {
        Long generatedId = rentalRepository.save(body);
        // 생성된 대여 기록을 다시 조회해서 rented_at, due_at까지 포함한 값 반환
        return rentalRepository.findById(generatedId);
    }
}