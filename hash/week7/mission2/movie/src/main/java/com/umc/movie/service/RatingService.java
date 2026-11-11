package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.BusinessException;
import com.umc.movie.exception.ErrorCode;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RatingService {
    private final MemberRepository memberRepository;
    private final RatingRepository ratingRepository;

    public List<RatingResponse> getRatingsByMember(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw new BusinessException(ErrorCode.MEMBER_NOT_FOUND);
        }

        return ratingRepository
                .findByMember_MemberIdOrderByCreatedAtDescRatingIdDesc(memberId)
                .stream()
                .map(RatingResponse::from)
                .toList();
    }

    @Transactional
    public RatingResponse create(Long memberId, CreateRatingRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(
                        () -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND)
                );

        if (ratingRepository.existsByMember_MemberIdAndMovieId(
                memberId, request.movieId()
        )) {
            throw new BusinessException(ErrorCode.DUPLICATE_RATING);
        }

        Rating rating = new Rating(
                member,
                request.movieId(),
                request.score(),
                request.comment()
        );

        return RatingResponse.from(ratingRepository.saveAndFlush(rating));
    }

    @Transactional
    public RatingResponse update(
            Long memberId, Long ratingId, UpdateRatingRequest request
    ) {
        Rating rating = findOwnedRating(memberId, ratingId);
        rating.update(request.score(), request.comment());
        ratingRepository.flush();
        return RatingResponse.from(rating);
    }

    @Transactional
    public void delete(Long memberId, Long ratingId) {
        ratingRepository.delete(findOwnedRating(memberId, ratingId));
    }

    private Rating findOwnedRating(Long memberId, Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(
                        () -> new BusinessException(ErrorCode.RATING_NOT_FOUND)
                );

        if (!rating.getMember().getMemberId().equals(memberId)) {
            throw new BusinessException(ErrorCode.RATING_FORBIDDEN);
        }

        return rating;
    }
}