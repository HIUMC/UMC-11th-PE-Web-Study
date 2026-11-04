package com.example.mission2.controller;

import com.example.mission2.dto.RentalRequest;
import com.example.mission2.dto.RentalResponse;
import com.example.mission2.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/rentals")
public class RentalController {
    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @PostMapping
    public ResponseEntity<RentalResponse> createRental(@RequestBody RentalRequest request) {
        RentalResponse response = rentalService.createRental(request);
        return ResponseEntity.created(URI.create("/rentals/" + response.rentalId())).body(response);
    }
}

