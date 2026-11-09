package com.example.demo.service;

import com.example.demo.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    public int createRental(Map<String, Object> body) {
        return rentalRepository.save(body);
    }

    public int returnRental(Long rentalId) {
        return rentalRepository.returnRental(rentalId);
    }
}