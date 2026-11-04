package com.umc.study.service;

import com.umc.study.dto.CreateRentalRequest;
import com.umc.study.dto.RentalResponse;
import com.umc.study.entity.Book;
import com.umc.study.entity.Rental;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;
    private final BookRepository bookRepository;

    @Transactional
    public RentalResponse createRental(CreateRentalRequest request) {
        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 도서입니다."));

        Rental rental = new Rental(request.userId(), book);
        Rental savedRental = rentalRepository.save(rental);

        return RentalResponse.from(savedRental);
    }

    @Transactional
    public void returnBook(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 대여 기록입니다."));

        rental.returnBook();
    }
}