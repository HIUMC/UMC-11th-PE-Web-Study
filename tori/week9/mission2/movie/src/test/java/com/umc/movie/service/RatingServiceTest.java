package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    // 중복 평점 등록 시 RATING409_1 예외 발생
    @Test
    void createDuplicateRatingThrowsConflictException() {
        // given
        Long memberId = 1L;
        Long movieId = 550L;

        Member member = mock(Member.class);

        given(memberRepository.findById(memberId))
                .willReturn(Optional.of(member));

        given(ratingRepository.existsByMember_MemberIdAndMovieId(memberId, movieId))
                .willReturn(true);

        CreateRatingRequest request =
                new CreateRatingRequest(movieId, 4, "재밌는 영화");

        // when & then
        assertThatThrownBy(() -> ratingService.create(memberId, request))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(exception.getCode()).isEqualTo("RATING409_1");
                });

        // 중복 등록이므로 save가 실행되지 않아야 함
        verify(ratingRepository, never()).save(any(Rating.class));
    }

    // 다른 회원의 평점을 수정하려 하면 RATING403_1 예외 발생
    @Test
    void updateOtherMembersRatingThrowsForbiddenException() {
        // given
        Long memberId = 1L;
        Long otherMemberId = 2L;
        Long ratingId = 10L;

        Member otherMember = mock(Member.class);
        given(otherMember.getMemberId()).willReturn(otherMemberId);

        Rating rating = Rating.builder()
                .member(otherMember)
                .movieId(550L)
                .score(4)
                .comment("기존 후기")
                .build();

        given(ratingRepository.findById(ratingId))
                .willReturn(Optional.of(rating));

        UpdateRatingRequest request =
                new UpdateRatingRequest(5, "수정한 후기");

        // when & then
        assertThatThrownBy(() -> ratingService.update(memberId, ratingId, request))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(exception.getCode()).isEqualTo("RATING403_1");
                });

        // 타인의 평점이므로 수정 및 저장이 실행되지 않아야 함
        verify(ratingRepository, never()).save(any(Rating.class));
    }
}