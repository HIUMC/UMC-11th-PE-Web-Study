package com.umc.umcine.service;

import com.umc.umcine.dto.CreateMovieRecordRequest;
import com.umc.umcine.dto.FavoriteResponse;
import com.umc.umcine.dto.MovieRecordResponse;
import com.umc.umcine.dto.RatingResponse;
import com.umc.umcine.entity.Favorite;
import com.umc.umcine.entity.Member;
import com.umc.umcine.entity.Rating;
import com.umc.umcine.exception.ApiException;
import com.umc.umcine.exception.MemberErrorCode;
import com.umc.umcine.exception.RatingErrorCode;
import com.umc.umcine.exception.FavoriteErrorCode;
import com.umc.umcine.repository.FavoriteRepository;
import com.umc.umcine.repository.MemberRepository;
import com.umc.umcine.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MovieRecordService {

    private final MemberRepository memberRepository;
    private final RatingRepository ratingRepository;
    private final FavoriteRepository favoriteRepository;

    @Transactional
    public MovieRecordResponse create(Long memberId, CreateMovieRecordRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(MemberErrorCode.NOT_FOUND));

        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(RatingErrorCode.DUPLICATE_RATING);
        }

        if (request.addToFavorites()
                && favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(FavoriteErrorCode.DUPLICATE_FAVORITE);
        }

        Rating rating = new Rating(member, request.movieId(), request.score(), request.comment());
        Rating savedRating = ratingRepository.save(rating);

        FavoriteResponse favoriteResponse = null;
        if (request.addToFavorites()) {
            Favorite favorite = Favorite.builder()
                    .member(member)
                    .movieId(request.movieId())
                    .build();
            Favorite savedFavorite = favoriteRepository.save(favorite);
            favoriteResponse = FavoriteResponse.from(savedFavorite);
        }

        return new MovieRecordResponse(
                RatingResponse.from(savedRating),
                favoriteResponse
        );
    }
}
