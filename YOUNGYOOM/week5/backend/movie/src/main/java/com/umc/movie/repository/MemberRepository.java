// src/main/java/com/umc/movie/repository/MemberRepository.java
package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
    //메서드 이름만으로 쿼리를 자동으로 생성해주는 query method
    boolean existsByNickname(String nickname);
    boolean existsByEmail(String email);
}