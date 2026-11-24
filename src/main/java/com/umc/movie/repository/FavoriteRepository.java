package com.umc.movie.repository;

import com.umc.movie.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByMember_MemberIdOrderByFavoriteIdDesc(Long memberId);

    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);

    @Modifying
    @Query("delete from Favorite f where f.member.memberId = :memberId and f.movieId = :movieId")
    int deleteByMemberAndMovie(@Param("memberId") Long memberId, @Param("movieId") Long movieId);
}
