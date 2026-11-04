package com.umc.study.service;

import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    public void createRental(Map<String, Object> body) {
        Long userId = ((Number) body.get("userId")).longValue();
        Long bookId = ((Number) body.get("bookId")).longValue();

        rentalRepository.save(userId, bookId);
    }

    public void returnRental(Long rentalId) {
        rentalRepository.updateReturnedAt(rentalId);
    }
}