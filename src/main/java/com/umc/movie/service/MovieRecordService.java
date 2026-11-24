package com.umc.movie.service;

import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.dto.RatingResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MovieRecordService {

    private final RatingService ratingService;
    private final FavoriteService favoriteService;

    @Transactional
    public MovieRecordResponse create(Long memberId, CreateMovieRecordRequest request) {
        // 두 서비스의 저장은 이 메서드가 시작한 트랜잭션에 참여합니다.
        RatingResponse rating = ratingService.create(memberId,
                new CreateRatingRequest(request.movieId(), request.score(), request.comment()));
        FavoriteResponse favorite = request.addToFavorites()
                ? favoriteService.create(memberId, new CreateFavoriteRequest(request.movieId()))
                : null;

        return new MovieRecordResponse(rating, favorite);
    }
}
