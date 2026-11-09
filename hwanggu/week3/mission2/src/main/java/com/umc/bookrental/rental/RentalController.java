package com.umc.bookrental.rental;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<String> createRental(@RequestBody Map<String, Object> body) {
        rentalService.createRental(body);
        return ResponseEntity.status(HttpStatus.CREATED).body("대여 기록이 생성되었습니다!");
    }

    @PatchMapping("/{rentalId}/return")
    public ResponseEntity<String> returnRental(@PathVariable Long rentalId) {
        if (!rentalService.returnRental(rentalId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("반납할 대여 기록이 없습니다.");
        }
        return ResponseEntity.ok("반납 처리되었습니다!");
    }
}
