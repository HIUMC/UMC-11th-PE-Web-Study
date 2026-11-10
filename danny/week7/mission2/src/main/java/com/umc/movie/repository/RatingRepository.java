package com.umc.movie.repository;

import com.umc.movie.entity.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Page<Rating> findByMember_MemberId(Long memberId, Pageable pageable);

    // 언더스코어(_)는 "연관된 엔티티를 타고 들어가라"는 표시입니다.
    // rating.member.memberId 를 조건으로 삼겠다는 뜻이에요.
    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);
}
