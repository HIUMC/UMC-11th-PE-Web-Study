// src/main/java/com/umc/movie/repository/MemberRepository.java
package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByNickname(String nickname);
    boolean existsByEmail(String email);

    // 7주차 추가: 로그인 시 이메일로 회원 조회
    Optional<Member> findByEmail(String email);

    // 7주차 추가: 본인을 제외한 닉네임 중복 검사
    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId);
}
