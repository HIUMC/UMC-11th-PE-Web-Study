package com.umc.umcine;

import com.umc.umcine.dto.CreateRatingRequest;
import com.umc.umcine.dto.UpdateRatingRequest;
import com.umc.umcine.entity.Member;
import com.umc.umcine.entity.Rating;
import com.umc.umcine.exception.ApiException;
import com.umc.umcine.repository.MemberRepository;
import com.umc.umcine.repository.RatingRepository;
import com.umc.umcine.service.RatingService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
@DisplayName("평점 서비스 단위 테스트")
class RatingServiceTest {
    @Mock private RatingRepository ratingRepository;
    @Mock private MemberRepository memberRepository;
    @Mock private Member owner;
    @InjectMocks private RatingService ratingService;

    @Test
    @DisplayName("같은 영화에 평점을 중복 등록하면 RATING409_1 예외를 던지고 저장하지 않는다")
    void duplicateRatingIsRejected() {
        // given
        given(memberRepository.findById(1L)).willReturn(Optional.of(owner));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> ratingService.create(1L, new CreateRatingRequest(550L, 4, "좋았어요")))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(exception.getCode()).isEqualTo("RATING409_1");
                });
        verify(ratingRepository, never()).save(any(Rating.class));
    }

    @Test
    @DisplayName("남의 평점을 수정하면 RATING403_1 예외를 던지고 기존 내용을 유지한다")
    void otherMemberCannotUpdateRating() {
        // given
        given(owner.getMemberId()).willReturn(1L);
        Rating rating = new Rating(owner, 550L, 4, "기존 후기");
        given(ratingRepository.findById(10L)).willReturn(Optional.of(rating));
        UpdateRatingRequest request = new UpdateRatingRequest();
        request.setScore(5);
        request.setComment("변경 시도");

        // when & then
        assertThatThrownBy(() -> ratingService.update(2L, 10L, request))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(exception.getCode()).isEqualTo("RATING403_1");
                });
        assertThat(rating.getScore()).isEqualTo(4);
        assertThat(rating.getComment()).isEqualTo("기존 후기");
        verify(ratingRepository, never()).save(any(Rating.class));
    }
}
