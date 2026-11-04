package com.umc.movierating.rating;

import com.umc.movierating.member.Member;
import com.umc.movierating.member.MemberRepository;
import com.umc.movierating.rating.dto.CreateRatingRequest;
import com.umc.movierating.rating.dto.RatingResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public RatingResponse createRating(CreateRatingRequest request) {
        Member member = memberRepository.findById(request.memberId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 1차 방어: 같은 영화에 이미 평점이 있으면 거절 (최종 방어선은 DB의 복합 UNIQUE)
        if (ratingRepository.existsByMember_MemberIdAndMovieId(member.getMemberId(), request.movieId())) {
            throw new IllegalArgumentException("이미 평점을 남긴 영화입니다.");
        }

        Rating rating = new Rating(member, request.movieId(), request.score());
        return RatingResponse.from(ratingRepository.save(rating));
    }

    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByMember(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        }
        return ratingRepository.findByMember_MemberIdOrderByCreatedAtDesc(memberId).stream()
                .map(RatingResponse::from)
                .toList();
    }
}
