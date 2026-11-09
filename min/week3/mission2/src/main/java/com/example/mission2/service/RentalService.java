package com.example.mission2.service;

import com.example.mission2.dto.RentalRequest;
import com.example.mission2.dto.RentalResponse;
import com.example.mission2.repository.RentalRepository;
import org.springframework.stereotype.Service;

@Service
public class RentalService {
    private final RentalRepository rentalRepository;

    public RentalService(RentalRepository rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    public RentalResponse createRental(RentalRequest request) {
        Long rentalId = rentalRepository.insert(request.userId(), request.bookId());
        return rentalRepository.findById(rentalId);
    }
}

