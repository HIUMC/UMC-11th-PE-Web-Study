// src/main/java/com/umc/movie/repository/MemberRepository.java
package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByNickname(String nickname);
    boolean existsByEmail(String email);
    // MemberRepository.java 에 추가 (import java.util.Optional; 도 함께)
    Optional<Member> findByEmail(String email);

    // MemberRepository.java 에 아래 메서드를 추가합니다
// "이 닉네임을 쓰는 회원이 있는가? 단, 나 자신은 빼고"를 한 번에 확인합니다
    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId);
}