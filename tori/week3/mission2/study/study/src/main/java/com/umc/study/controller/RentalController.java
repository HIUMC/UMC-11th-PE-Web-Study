// src/main/java/.../controller/RentalController.java
package com.umc.study.controller;

import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // POST /rentals - userId, bookId를 Body로 받아 대여 기록 생성
    @PostMapping
    public ResponseEntity<Map<String, Object>> createRental(@RequestBody Map<String, Object> body) {
        Map<String, Object> rental = rentalService.createRental(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(rental);
    }
}