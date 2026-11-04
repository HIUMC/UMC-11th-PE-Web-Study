package com.umc.study.controller;

import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    // [미션 2] POST /rentals - 생성이므로 201 Created
    @PostMapping
    public ResponseEntity<Map<String, Object>> createRental(@RequestBody Map<String, Object> body) {
        Long rentalId = rentalService.createRental(body);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("rentalId", rentalId, "message", "대여가 완료되었습니다!"));
    }

    // [선택 미션] PATCH /rentals/{rentalId}/return
    @PatchMapping("/{rentalId}/return")
    public Map<String, Object> returnRental(@PathVariable("rentalId") Long rentalId) {
        rentalService.returnRental(rentalId);
        return Map.of("rentalId", rentalId, "message", "반납이 완료되었습니다!");
    }
}
