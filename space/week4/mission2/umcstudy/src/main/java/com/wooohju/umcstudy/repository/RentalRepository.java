package com.wooohju.umcstudy.repository;

import com.wooohju.umcstudy.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RentalRepository extends JpaRepository<Rental, Long> {

    Optional<Rental> findByBookBookIdAndReturnedAtIsNull(Long bookId);
}
