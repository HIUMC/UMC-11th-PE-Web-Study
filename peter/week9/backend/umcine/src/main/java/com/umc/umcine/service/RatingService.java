package com.umc.umcine.service;

import com.umc.umcine.dto.CreateRatingRequest;
import com.umc.umcine.dto.RatingResponse;
import com.umc.umcine.dto.UpdateRatingRequest;
import com.umc.umcine.dto.ReplaceRatingRequest;
import com.umc.umcine.entity.Member;
import com.umc.umcine.entity.Rating;
import com.umc.umcine.exception.ApiException;
import com.umc.umcine.exception.MemberErrorCode;
import com.umc.umcine.exception.RatingErrorCode;
import com.umc.umcine.repository.MemberRepository;
import com.umc.umcine.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByMember(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw new ApiException(MemberErrorCode.NOT_FOUND);
        }

        return ratingRepository
                .findByMember_MemberIdOrderByRatingIdDesc(memberId)
                .stream()
                .map(RatingResponse::from)
                .toList();
    }

    @Transactional
    public RatingResponse create(
            Long memberId,
            CreateRatingRequest request
    ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(MemberErrorCode.NOT_FOUND));

        if (ratingRepository.existsByMember_MemberIdAndMovieId(
                memberId,
                request.movieId()
        )) {
            throw new ApiException(RatingErrorCode.DUPLICATE_RATING);
        }

        Rating rating = new Rating(
                member,
                request.movieId(),
                request.score(),
                request.comment()
        );

        return RatingResponse.from(ratingRepository.save(rating));
    }

    @Transactional
    public RatingResponse update(
            Long memberId,
            Long ratingId,
            UpdateRatingRequest request
    ) {
        Rating rating = findOwnedRating(memberId, ratingId);

        rating.update(request.hasScore() ? request.score() : rating.getScore(),
                request.hasComment() ? request.comment() : rating.getComment());
        ratingRepository.save(rating);

        return RatingResponse.from(rating);
    }

    @Transactional
    public RatingResponse replace(Long memberId, Long ratingId, ReplaceRatingRequest request) {
        Rating rating = findOwnedRating(memberId, ratingId);
        rating.update(request.score(), request.comment());
        return RatingResponse.from(rating);
    }

    @Transactional
    public void delete(Long memberId, Long ratingId) {
        Rating rating = findOwnedRating(memberId, ratingId);
        ratingRepository.delete(rating);
    }

    private Rating findOwnedRating(Long memberId, Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ApiException(RatingErrorCode.NOT_FOUND));

        if (!rating.getMember().getMemberId().equals(memberId)) {
            throw new ApiException(RatingErrorCode.FORBIDDEN);
        }

        return rating;
    }
}