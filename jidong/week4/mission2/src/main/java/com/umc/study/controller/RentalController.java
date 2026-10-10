package com.umc.study.controller;

import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/rentals") // 기본 주소를 /rentals 로 설정!
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    // POST http://localhost:8080/rentals
    @PostMapping
    public Map<String, String> createRental(@RequestBody Map<String, Object> body) {
        rentalService.createRental(body);
        return Map.of("message", "도서 대여 기록이 성공적으로 생성되었습니다!");
    }
}