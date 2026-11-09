package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByNickname(String nickname);
    boolean existsByEmail(String email);

    // 7주차: 로그인할 때 이메일로 회원 자체를 꺼내 옴
    Optional<Member> findByEmail(String email);

    // 7주차: "이 닉네임 쓰는 회원 있나? 단, 나는 빼고"를 한 번에 확인함
    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId);
}
