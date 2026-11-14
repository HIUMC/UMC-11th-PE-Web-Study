// src/main/java/com/umc/movie/repository/MemberRepository.java
package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    //메서드 이름만으로 쿼리를 자동으로 생성해주는 query method
    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);

    //회원 자체를 꺼내오는 메서드
    Optional<Member> findByEmail(String email);

    //스프링 데이터 JPA가 메서드 이름을 읽고 쿼리를 만듦
    //같은 닉네임을 쓰는 다른 회원이 있는지 확인
    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId);
}
