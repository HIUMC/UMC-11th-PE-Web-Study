package com.umc.movie.repository;

import com.umc.movie.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // 내 즐겨찾기만 최신 등록 순서로 조회
    List<Favorite> findByMember_MemberIdOrderByFavoriteIdDesc(Long memberId);

    // 해제할 때 내 즐겨찾기 중에서 해당 영화를 찾음
    Optional<Favorite> findByMember_MemberIdAndMovieId(Long memberId, Long movieId);

    // 중복 등록 사전 검사, 즐겨찾기 여부 조회에 씀
    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);
}
