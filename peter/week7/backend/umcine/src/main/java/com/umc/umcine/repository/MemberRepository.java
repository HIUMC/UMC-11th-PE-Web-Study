package com.umc.umcine.repository;

import com.umc.umcine.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);

    boolean existsByNicknameAndMemberIdNot(
            String nickname,
            Long memberId
    );

    Optional<Member> findByEmail(String email);
}