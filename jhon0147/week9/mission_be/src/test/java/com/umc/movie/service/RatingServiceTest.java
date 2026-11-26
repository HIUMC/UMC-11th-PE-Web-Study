package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {
    @Mock RatingRepository ratings;
    @Mock MemberRepository members;
    @InjectMocks RatingService ratingService;

    @Test
    @DisplayName("같은 회원·영화의 평점 중복 등록은 409와 RATING409_1이며 저장하지 않는다")
    void createRatingWhenDuplicated() {
        // given
        Member member = new Member("rating@umc.com", "unused", "평점회원");
        given(members.findById(1L)).willReturn(Optional.of(member));
        given(ratings.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> ratingService.create(1L, new CreateRatingRequest(550L, 5, "후기")))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(exception.getCode()).isEqualTo("RATING409_1");
                });
        verify(ratings, never()).save(any(Rating.class));
    }

    @Test
    @DisplayName("다른 회원의 평점 수정은 403과 RATING403_1이며 원래 값을 유지한다")
    void updateRatingOwnedByAnotherMember() {
        // given: 2번 회원이 작성한 평점
        Member writer = new Member("writer@umc.com", "unused", "작성회원");
        ReflectionTestUtils.setField(writer, "memberId", 2L);
        Rating rating = new Rating(writer, 550L, 3, "원래 후기");
        given(ratings.findById(10L)).willReturn(Optional.of(rating));

        // when & then: 1번 회원의 수정 요청
        assertThatThrownBy(() -> ratingService.update(1L, 10L, new UpdateRatingRequest(5, "수정 후기")))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(exception.getCode()).isEqualTo("RATING403_1");
                });
        assertThat(rating.getScore()).isEqualTo(3);
        assertThat(rating.getComment()).isEqualTo("원래 후기");
        verify(ratings, never()).flush();
    }
}
