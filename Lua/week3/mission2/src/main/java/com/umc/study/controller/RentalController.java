package com.umc.study.controller;

import com.umc.study.dto.RentalCreateRequest;
import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<Map<String, String>> createRental(@RequestBody RentalCreateRequest request) {
        rentalService.createRental(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "도서 대여 기록이 생성되었습니다."));
    }

    @PatchMapping("/{rentalId}/return")
    public Map<String, String> returnRental(@PathVariable Long rentalId) {
        if (!rentalService.returnRental(rentalId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "대여 기록을 찾을 수 없습니다.");
        }
        return Map.of("message", "도서 반납 처리가 완료되었습니다.");
    }
}
