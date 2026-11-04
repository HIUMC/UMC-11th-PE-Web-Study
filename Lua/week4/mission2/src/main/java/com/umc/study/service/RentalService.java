package com.umc.study.service;

import com.umc.study.dto.RentalCreateRequest;
import com.umc.study.entity.Book;
import com.umc.study.entity.Rental;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class RentalService {
    private final RentalRepository rentalRepository;
    private final BookRepository bookRepository;

    @Transactional
    public void createRental(RentalCreateRequest request) {
        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "존재하지 않는 도서입니다."));
        rentalRepository.save(new Rental(request.userId(), book));
    }

    @Transactional
    public void returnRental(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "대여 기록을 찾을 수 없습니다."));
        rental.returnBook();
    }
}
