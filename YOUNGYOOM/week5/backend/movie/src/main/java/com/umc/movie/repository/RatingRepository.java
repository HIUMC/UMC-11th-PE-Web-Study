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
}