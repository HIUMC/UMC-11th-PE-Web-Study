package com.umc.movierating.rating;

import com.umc.movierating.global.BaseTimeEntity;
import com.umc.movierating.member.Member;
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
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "rating",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_member_movie",
                columnNames = {"member_id", "movie_id"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Rating extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private Long ratingId;

    // 평점 조회 시 회원까지 매번 따라오지 않도록 LAZY
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 영화 정보는 외부 API(TMDB)의 id라 연관관계가 아닌 값으로 보관
    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Column(nullable = false)
    private Double score;

    public Rating(Member member, Long movieId, Double score) {
        this.member = member;
        this.movieId = movieId;
        this.score = score;
    }
}
