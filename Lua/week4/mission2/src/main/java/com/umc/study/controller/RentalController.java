package com.umc.study.controller;

import com.umc.study.dto.RentalCreateRequest;
import com.umc.study.service.RentalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {
    private final RentalService rentalService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createRental(@Valid @RequestBody RentalCreateRequest request) {
        rentalService.createRental(request);
    }

    @PatchMapping("/{rentalId}/return")
    @ResponseStatus(HttpStatus.OK)
    public void returnRental(@PathVariable Long rentalId) {
        rentalService.returnRental(rentalId);
    }
}
