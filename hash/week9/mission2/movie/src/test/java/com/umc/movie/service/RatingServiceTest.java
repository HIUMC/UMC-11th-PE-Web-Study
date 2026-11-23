package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.BusinessException;
import com.umc.movie.exception.ErrorCode;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {
    @Mock RatingRepository ratingRepository;
    @Mock MemberRepository memberRepository;
    @InjectMocks RatingService ratingService;

    @Test
    @DisplayName("같은 영화의 중복 평점은 RATING409_1을 던지고 저장하지 않는다")
    void rejectsDuplicateRating() {
        Member member = new Member("fixture@example.com", "test-only", "테스트");
        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        assertThatThrownBy(() -> ratingService.create(1L, new CreateRatingRequest(550L, 5, "후기")))
                .isInstanceOfSatisfying(BusinessException.class,
                        e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.DUPLICATE_RATING));
        verify(ratingRepository, never()).saveAndFlush(any());
    }

    @Test
    @DisplayName("타인의 평점 수정은 RATING403_1을 던지고 기존 값을 유지한다")
    void rejectsAnotherMembersRating() {
        Member owner = new Member("owner@example.com", "test-only", "작성자");
        ReflectionTestUtils.setField(owner, "memberId", 2L);
        Rating rating = new Rating(owner, 550L, 5, "원래 후기");
        given(ratingRepository.findById(10L)).willReturn(Optional.of(rating));

        assertThatThrownBy(() -> ratingService.update(1L, 10L, new UpdateRatingRequest(1, "수정 시도")))
                .isInstanceOfSatisfying(BusinessException.class,
                        e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.RATING_FORBIDDEN));
        assertThat(rating.getScore()).isEqualTo(5);
        assertThat(rating.getComment()).isEqualTo("원래 후기");
        verify(ratingRepository, never()).flush();
    }
}
