package com.umc.movie.service;

import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.BusinessException;
import com.umc.movie.exception.ErrorCode;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
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
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        Long movieId = request.movieId();
        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, movieId)) {
            throw new BusinessException(ErrorCode.DUPLICATE_RATING);
        }
        if (request.addToFavorites() && favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, movieId)) {
            throw new BusinessException(ErrorCode.DUPLICATE_FAVORITE);
        }

        Rating rating = ratingRepository.saveAndFlush(
                new Rating(member, movieId, request.score(), request.comment())
        );

        FavoriteResponse favorite = null;
        if (request.addToFavorites()) {
            favorite = FavoriteResponse.from(
                    favoriteRepository.saveAndFlush(new Favorite(member, movieId))
            );
        }

        return new MovieRecordResponse(RatingResponse.from(rating), favorite);
    }
}