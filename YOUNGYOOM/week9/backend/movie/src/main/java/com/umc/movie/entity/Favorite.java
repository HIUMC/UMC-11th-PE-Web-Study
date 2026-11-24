
// 1. src/main/java/com/umc/movie/entity/Favorite.java
package com.umc.movie.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

//회원이 즐겨찾기에 추가한 영화 한 편을 나타내는 엔티티
//BaseTimeEntity를 상속해 생성 시각을 사용할 수 있음
@Entity
//같은 회원이 같은 영화를 두 번 등록 못하도록 두 컬럼의 조합에 유니크 제약
@Table(name = "favorite",
        uniqueConstraints = @UniqueConstraint(columnNames = {"member_id", "movie_id"})
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) //JPA가 엔티티 생성할 때 사용하는 기본 생성자
public class Favorite extends BaseTimeEntity {
    //즐겨찾기 항목 자체의 기본 키이며, 값을 DB에서 자동 생성
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Long favoriteId;

    //즐겨찾기의 주인은 로그인 한 회원
    //한 회원은 여러 즐겨찾기를 가질 수 있으며, 연결된 회원 정보는 필요 시 조회
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    //TMDB영화 ID 그대로 저장함
    //우리 DB의 외래키는 아님
    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    //회원과 영화 ID를 받아 새로운 즐겨찾기 엔티티 생성(요청)
    @Builder
    public Favorite(Member member, Long movieId) {
        this.member = member;
        this.movieId = movieId;
    }

}
