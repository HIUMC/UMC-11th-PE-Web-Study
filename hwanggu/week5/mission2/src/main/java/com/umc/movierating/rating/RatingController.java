package com.umc.movierating.rating;

import com.umc.movierating.rating.dto.CreateRatingRequest;
import com.umc.movierating.rating.dto.RatingResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // 평점 등록
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RatingResponse createRating(@Valid @RequestBody CreateRatingRequest request) {
        return ratingService.createRating(request);
    }
}
