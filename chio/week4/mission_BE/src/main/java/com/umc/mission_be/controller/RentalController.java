package com.umc.mission_be.controller;

import com.umc.mission_be.service.RentalService;
import com.umc.mission_be.dto.CreateRentalRequest;
import com.umc.mission_be.dto.RentalResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public RentalResponse createRental(@Valid @RequestBody CreateRentalRequest request) {
        return rentalService.createRental(request);
    }
}
