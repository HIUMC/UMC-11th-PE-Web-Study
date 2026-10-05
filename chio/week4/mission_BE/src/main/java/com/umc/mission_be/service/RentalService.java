package com.umc.mission_be.service;

import com.umc.mission_be.repository.RentalRepository;
import com.umc.mission_be.repository.UserRepository;
import com.umc.mission_be.repository.BookRepository;
import com.umc.mission_be.dto.CreateRentalRequest;
import com.umc.mission_be.dto.RentalResponse;
import com.umc.mission_be.entity.User;
import com.umc.mission_be.entity.Book;
import com.umc.mission_be.entity.Rental;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Transactional
    public RentalResponse createRental(CreateRentalRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다."
                ));

        // 같은 책에 대한 동시 대여 요청을 순서대로 처리합니다.
        Book book = bookRepository.findByIdForUpdate(request.bookId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "존재하지 않는 도서입니다."
                ));

        if (!Boolean.TRUE.equals(book.getIsAvailable())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "대여할 수 없는 도서입니다.");
        }

        Rental rental = new Rental(user, book, LocalDateTime.now());
        book.markAsRented();
        return RentalResponse.from(rentalRepository.save(rental));
    }
}
