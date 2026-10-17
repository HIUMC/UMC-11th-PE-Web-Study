package com.umc.study.dto;

import com.umc.study.entity.Rental;

import java.time.LocalDateTime;

public record RentalResponse(
        Long rentalId,
        Long userId,
        Long bookId,
        String bookTitle,
        LocalDateTime rentedAt,
        LocalDateTime dueAt,
        LocalDateTime returnedAt
) {
    public static RentalResponse from(Rental rental) {
        return new RentalResponse(
                rental.getRentalId(),
                rental.getUserId(),
                rental.getBook().getBookId(),
                rental.getBook().getTitle(),
                rental.getRentedAt(),
                rental.getDueAt(),
                rental.getReturnedAt()
        );
    }
}