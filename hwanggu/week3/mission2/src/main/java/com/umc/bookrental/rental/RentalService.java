package com.umc.bookrental.rental;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    public void createRental(Map<String, Object> body) {
        rentalRepository.save(body);
    }

    public boolean returnRental(Long rentalId) {
        return rentalRepository.markReturned(rentalId) > 0;
    }
}
