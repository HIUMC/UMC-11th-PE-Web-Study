// src/main/java/com/umc/movie/repository/FavoriteRepository.java
package com.umc.movie.repository;

import com.umc.movie.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


//즐겨찾기를 조회하고 저장하거나 삭제하는 레포지토리
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // 특정 회원의 즐겨찾기 목록을 즐겨찾기 ID가 큰 순서대로 조회
    // Member_MemberId는 Favorite의 member가 객체 내 memberId를 가리킴
    List<Favorite> findByMember_MemberIdOrderByFavoriteIdDesc(Long memberId);

    //특정 회원이 특정 영화를 즐겨찾기한 항목 조회
    //해당 항목이 없으면 Optional.empty()를 반환
    Optional<Favorite> findByMember_MemberIdAndMovieId(Long member, Long movieId);

    //특정 회원의 즐겨찾기에 해당 영화가 등록되어있는지 확인
    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);


}
