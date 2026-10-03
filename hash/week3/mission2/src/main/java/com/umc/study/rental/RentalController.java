package com.umc.study.rental;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRental(
            @RequestBody Map<String, Object> body
    ) {
        long rentalId = rentalService.createRental(body);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                        "message", "대여가 등록되었습니다.",
                        "rentalId", rentalId
                )
        );
    }

    @PatchMapping("/{rentalId}/return")
    public Map<String, Object> returnRental(
            @PathVariable("rentalId") long rentalId
    ) {
        rentalService.returnRental(rentalId);

        return Map.of(
                "message", "반납이 완료되었습니다.",
                "rentalId", rentalId
        );
    }
}