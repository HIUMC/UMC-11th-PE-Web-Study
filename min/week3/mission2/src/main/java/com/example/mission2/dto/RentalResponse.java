package com.example.mission2.dto;

import java.time.LocalDateTime;

public record RentalResponse(Long rentalId, Long userId, Long bookId,
                             LocalDateTime rentedAt, LocalDateTime dueAt, LocalDateTime returnedAt) {
}

