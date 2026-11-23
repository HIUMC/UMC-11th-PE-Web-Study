package com.umc.movie.repository;

import com.umc.movie.entity.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    //회원의 전체 평점을 ID 내림차순으로 조회
    List<Rating> findByMember_MemberIdOrderByRatingIdDesc(Long memberId);

    //회원의 평점을 페이지 단위로 조회
    Page<Rating> findByMember_MemberId(Long memberId, Pageable pageable);

    //같은 회원이 같은 영화에 평점을 남겼는지 확ㄱ인
    //Member_MemberId의 밑줄 = Rating의 member를 거쳐 memberId를 조회한다는 의미
    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);
}