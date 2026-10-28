package com.umc.movierating.rating.dto;

import com.umc.movierating.rating.Rating;
import java.time.LocalDateTime;

public record RatingResponse(
        Long ratingId,
        Long movieId,
        Double score,
        LocalDateTime createdAt
) {
    public static RatingResponse from(Rating rating) {
        return new RatingResponse(
                rating.getRatingId(),
                rating.getMovieId(),
                rating.getScore(),
                rating.getCreatedAt()
        );
    }
}
