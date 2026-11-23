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

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    // 소유자 비교에 memberId가 쓰이는데, DB에 저장하지 않으면 id가 비어 있어서 직접 채워줍니다.
    private Member memberWithId(Long memberId, String email, String nickname) {
        Member member = Member.builder()
                .email(email)
                .password("암호화된비밀번호")
                .nickname(nickname)
                .build();
        ReflectionTestUtils.setField(member, "memberId", memberId);
        return member;
    }

    @Test
    @DisplayName("같은 영화에 평점을 중복 등록하면 409와 RATING409_1 예외를 던지고 저장하지 않는다")
    void createRatingWhenDuplicated() {
        // given: 같은 회원이 같은 영화에 이미 평점을 남겨 둔 상황
        Member member = memberWithId(1L, "challenger@umc.com", "영화조아");
        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        // when & then: 예외가 나고, 저장은 시도조차 하지 않는다
        assertThatThrownBy(() -> ratingService.create(1L, new CreateRatingRequest(550L, 5, "또 남겨봅니다")))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("code", "RATING409_1")
                .hasFieldOrPropertyWithValue("status", HttpStatus.CONFLICT);

        verify(ratingRepository, never()).save(any(Rating.class));
    }

    @Test
    @DisplayName("남의 평점을 수정하려 하면 403과 RATING403_1 예외를 던지고 저장하지 않는다")
    void updateRatingOfOtherMember() {
        // given: 평점의 주인은 1번 회원인데, 2번 회원이 수정하려는 상황
        Member owner = memberWithId(1L, "owner@umc.com", "주인");
        Rating rating = Rating.builder().member(owner).movieId(550L).score(5).comment("내 평점").build();
        given(ratingRepository.findById(10L)).willReturn(Optional.of(rating));

        // when & then: 소유권 검사에서 막히고, 평점은 바뀌지 않는다
        assertThatThrownBy(() -> ratingService.update(2L, 10L, new UpdateRatingRequest(1, "남의 평점을 고쳐봅니다")))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("code", "RATING403_1")
                .hasFieldOrPropertyWithValue("status", HttpStatus.FORBIDDEN);

        verify(ratingRepository, never()).save(any(Rating.class));
    }
}
