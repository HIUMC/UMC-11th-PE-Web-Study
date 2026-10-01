package com.umc.study.rental;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    @Transactional
    public long createRental(Map<String, Object> body) {
        long userId = readPositiveId(body, "userId");
        long bookId = readPositiveId(body, "bookId");

        if (!rentalRepository.existsUser(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."
            );
        }

        if (!rentalRepository.existsBook(bookId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "존재하지 않는 책입니다."
            );
        }

        int updatedRows = rentalRepository.markBookAsRented(bookId);

        if (updatedRows == 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "현재 대여할 수 없는 책입니다."
            );
        }

        return rentalRepository.save(userId, bookId);
    }

    private long readPositiveId(Map<String, Object> body, String key) {
        Object value = body.get(key);

        if (!(value instanceof Integer || value instanceof Long)
                || ((Number) value).longValue() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    key + "는 양의 정수여야 합니다."
            );
        }

        return ((Number) value).longValue();
    }

    @Transactional
    public void returnRental(long rentalId) {
        if (rentalId <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "rentalId는 양의 정수여야 합니다."
            );
        }

        Long bookId = rentalRepository.findBookIdByRentalId(rentalId);

        if (bookId == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "존재하지 않는 대여 기록입니다."
            );
        }

        int updatedRows = rentalRepository.markAsReturned(rentalId);

        if (updatedRows == 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 반납한 대여 기록입니다."
            );
        }

        rentalRepository.markBookAsAvailable(bookId);
    }
}