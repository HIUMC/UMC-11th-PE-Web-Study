package com.umc.movie.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "favorite", uniqueConstraints = @UniqueConstraint(
        name = "uk_favorite_member_movie", columnNames = {"member_id", "movie_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Favorite extends BaseTimeEntity {
    @Id //기본키
    @GeneratedValue(strategy = GenerationType.IDENTITY) //기본키 값을 DB의 자동 번호 생성 기능으로 만들도록 설정
    @Column(name = "favorite_id") //연결할 db 칼럼 이름
    private Long favoriteId; //java 필드(객체가 가질 데이터 담는 역할) 이름

    @ManyToOne(fetch = FetchType.LAZY) //현재 클래스인 favorite를 many로서 연결
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    public Favorite(Member member, Long movieId) {
        this.member = member;
        this.movieId = movieId;
    }
}
