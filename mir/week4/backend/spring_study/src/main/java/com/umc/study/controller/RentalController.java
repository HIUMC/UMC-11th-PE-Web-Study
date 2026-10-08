package com.umc.study.controller;

import com.umc.study.dto.CreateRentalRequest;
import com.umc.study.dto.RentalResponse;
import com.umc.study.service.RentalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RentalResponse createRental(@Valid @RequestBody CreateRentalRequest request) {
        return rentalService.createRental(request);
    }

    @PatchMapping("/{rentalId}/return")
    public String returnBook(@PathVariable Long rentalId) {
        rentalService.returnBook(rentalId);
        return "도서 반납 처리가 완료되었습니다!";
    }
}