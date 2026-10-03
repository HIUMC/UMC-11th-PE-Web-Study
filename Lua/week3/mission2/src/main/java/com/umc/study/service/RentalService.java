package com.umc.study.service;

import com.umc.study.dto.RentalCreateRequest;
import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    public void createRental(RentalCreateRequest request) {
        rentalRepository.save(request);
    }

    public boolean returnRental(Long rentalId) {
        return rentalRepository.updateReturnedAt(rentalId) > 0;
    }
}
