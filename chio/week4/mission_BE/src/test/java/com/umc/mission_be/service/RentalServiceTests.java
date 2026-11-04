package com.umc.mission_be.service;

import com.umc.mission_be.dto.CreateRentalRequest;
import com.umc.mission_be.dto.RentalResponse;
import com.umc.mission_be.entity.Book;
import com.umc.mission_be.entity.Category;
import com.umc.mission_be.entity.Rental;
import com.umc.mission_be.entity.User;
import com.umc.mission_be.repository.BookRepository;
import com.umc.mission_be.repository.RentalRepository;
import com.umc.mission_be.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RentalServiceTests {
    private RentalRepository rentalRepository;
    private UserRepository userRepository;
    private BookRepository bookRepository;
    private RentalService service;
    private final CreateRentalRequest request = new CreateRentalRequest(1L, 2L);

    @BeforeEach
    void setUp() {
        // 인터페이스만 모킹하므로 JVM 에이전트 부착이 필요 없는 방식을 사용합니다.
        rentalRepository = mock(RentalRepository.class, withSettings().mockMaker("mock-maker-subclass"));
        userRepository = mock(UserRepository.class, withSettings().mockMaker("mock-maker-subclass"));
        bookRepository = mock(BookRepository.class, withSettings().mockMaker("mock-maker-subclass"));
        service = new RentalService(rentalRepository, userRepository, bookRepository);
    }

    @Test
    void successfulRentalMakesBookUnavailableAndSetsSevenDayDeadline() {
        Book book = new Book(new Category("문학"), "테스트 도서", null);
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User("독자")));
        when(bookRepository.findByIdForUpdate(2L)).thenReturn(Optional.of(book));
        when(rentalRepository.save(any(Rental.class))).thenAnswer(call -> call.getArgument(0));

        RentalResponse response = service.createRental(request);

        assertFalse(book.getIsAvailable());
        assertEquals(response.rentedAt().plusDays(7), response.dueAt());
        assertNull(response.returnedAt());
        verify(rentalRepository).save(any(Rental.class));
    }

    @Test
    void missingUserDoesNotSaveRental() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.createRental(request));

        assertEquals(HttpStatus.NOT_FOUND, error.getStatusCode());
        verifyNoInteractions(bookRepository, rentalRepository);
    }

    @Test
    void missingBookDoesNotSaveRental() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User("독자")));
        when(bookRepository.findByIdForUpdate(2L)).thenReturn(Optional.empty());

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.createRental(request));

        assertEquals(HttpStatus.NOT_FOUND, error.getStatusCode());
        verifyNoInteractions(rentalRepository);
    }

    @Test
    void unavailableBookDoesNotSaveRental() {
        Book book = new Book(new Category("문학"), "테스트 도서", null);
        book.markAsRented();
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User("독자")));
        when(bookRepository.findByIdForUpdate(2L)).thenReturn(Optional.of(book));

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.createRental(request));

        assertEquals(HttpStatus.CONFLICT, error.getStatusCode());
        verifyNoInteractions(rentalRepository);
    }
}
