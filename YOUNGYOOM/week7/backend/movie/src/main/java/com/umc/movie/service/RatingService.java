// src/main/java/com/umc/movie/service/RatingService.java
package com.umc.movie.service;

import com.umc.movie.dto.RatingResponse;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.repository.MemberRepository;

import com.umc.movie.dto.rating.CreateRatingRequest;
import com.umc.movie.dto.rating.UpdateRatingRequest;

import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;


@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public Page<RatingResponse> getRatingsByMember(
            Long memberId, int page, int size
    ) {
        // 페이지 번호/크기 검사
        if (page < 0 || size < 1 || size > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "page는 0 이상, size는 1~100이어야 합니다."
            );
        }

        // 회원 존재 X -> 404반환
        if (!memberRepository.existsById(memberId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                    "해당 회원을 찾을 수 없습니다.");
        }

        //페이지 번호/크기/정렬기준 설정(평점 ID가 큰 순으로 정렬, 요청 페이지 조회)
        PageRequest pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "ratingId")
        );

        // 페이지 단위로 조회하고, 각 엔티티를 응답 DTO로 변환
        return ratingRepository.findByMember_MemberId(memberId, pageable)
                .map(RatingResponse::from);
    }

    //평점을 등록하고 저장된 평점의 ID 반환
    @Transactional
    public RatingResponse create(Long memberId, CreateRatingRequest request) {
        //평점을 작성할 회원 찾음, 해당 회원 ID가 없으면 404 반환
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."
                ));

        //한 회원은 같은 영화에 평점을 한 번만 등록 가능
        //이미 등록했다면 전역 예외 처리기가 이 예외를 409로 바꿈
        //동시 요청으로 사전 검사를 모두 통과해도 DB의 복잡한 UNIQUE 제약이 중복 저장을 막음
        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "RATING409_1",
                    "이미 이 영화에 평점을 남기셨습니다."
            );
        }

        //찾은 회원과 요청 본문의 값으로 새 평점 엔티티를 만듦
        Rating rating = Rating.builder()
                .member(member)
                .movieId(request.movieId())
                .score(request.score())
                .comment(request.comment())
                .build();

        // DB에 저장한 뒤 새로 부여된 평점 ID 반환
        return RatingResponse.from(ratingRepository.save(rating));
    }

    //요청된 회원 ID가 평점 작성자의 ID와 일치하면 별점과 후기를 수정함
    @Transactional
    public RatingResponse update(Long memberId, Long ratingId, UpdateRatingRequest request) {
        Rating rating = findOwnedRating(memberId, ratingId);

        rating.update(request.score(), request.comment());
        ratingRepository.save(rating);

        //변경된 별점과 후기가 담긴 응답 DTO 반환
        return RatingResponse.from(rating);
    }

    //수정과 같은 소유자 검사를 거친 뒤 평점 삭제
    @Transactional
    public void delete(Long memberId, Long ratingId) {
        Rating rating = findOwnedRating(memberId, ratingId);

        ratingRepository.delete(rating);
    }

    //수정과 삭제에서 공통으로 사용하는 평점 조회 및 소유자 확인 메서드
    private Rating findOwnedRating(Long memberId, Long ratingId) {
        //평점 자체가 없으면 404를 반환
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "RATING404_1",
                        "해당 평점을 찾을 수 없습니다."
                ));

        //저장된 평점의 작성자 ID와 URL에서 받은 회원 ID를 비교
        //두 ID가 다르면 403 반환
        if (!rating.getMember().getMemberId().equals(memberId)) {
            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "RATING403_1",
                    "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다."
            );
        }
        return rating;
    }


}
