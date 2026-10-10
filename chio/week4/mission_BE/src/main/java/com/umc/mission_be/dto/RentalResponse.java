package com.umc.mission_be.dto;

import com.umc.mission_be.entity.Rental;
import java.time.LocalDateTime;

public record RentalResponse(
        Long rentalId, Long userId, Long bookId,
        LocalDateTime rentedAt, LocalDateTime dueAt, LocalDateTime returnedAt
) {
    public static RentalResponse from(Rental rental) {
        return new RentalResponse(
                rental.getRentalId(), rental.getUser().getUserId(),
                rental.getBook().getBookId(), rental.getRentedAt(),
                rental.getDueAt(), rental.getReturnedAt()
        );
    }
}
