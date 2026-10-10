package com.example.demo.controller;

import com.example.demo.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createRental(
            @RequestBody Map<String, Object> body
    ) {
        int affectedRows = rentalService.createRental(body);

        return Map.of(
                "message", "대여 기록이 생성되었습니다.",
                "affectedRows", affectedRows
        );
    }

    @PatchMapping("/{rentalId}/return")
    public Map<String, Object> returnRental(
            @PathVariable Long rentalId
    ) {
        int affectedRows = rentalService.returnRental(rentalId);

        if (affectedRows == 0) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "대여 기록을 찾을 수 없습니다."
            );
        }

        return Map.of(
                "message", "도서 반납이 완료되었습니다.",
                "rentalId", rentalId,
                "affectedRows", affectedRows
        );
    }
}