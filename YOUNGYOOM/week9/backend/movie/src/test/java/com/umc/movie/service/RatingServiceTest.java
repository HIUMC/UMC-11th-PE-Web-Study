package com.umc.movie.service;

import com.umc.movie.dto.rating.CreateRatingRequest;
import com.umc.movie.dto.rating.UpdateRatingRequest;
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

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    @Test
    @DisplayName("같은 회원이 같은 영화에 평점을 중복 등록하면 409와 RATING409_1 예외가 발생한다")
    void rejectsDuplicateRating() {
        long memberId = 1L;
        long movieId = 550L;
        var request = new CreateRatingRequest(movieId, 5, "좋았어요");

        when(memberRepository.findById(memberId))
                .thenReturn(Optional.of(mock(Member.class)));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(memberId, movieId))
                .thenReturn(true);

        ApiException exception = assertThrows(ApiException.class,
                () -> ratingService.create(memberId, request));

        assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(exception.getCode()).isEqualTo("RATING409_1");
    }

    @Test
    @DisplayName("다른 회원의 평점을 수정하면 403과 RATING403_1 예외가 발생한다")
    void rejectsUpdatingAnotherMembersRating() {
        long requesterId = 1L;
        long ownerId = 2L;
        long ratingId = 10L;
        var request = new UpdateRatingRequest(4, "수정한 후기");

        Member owner = mock(Member.class);
        when(owner.getMemberId()).thenReturn(ownerId);

        Rating rating = Rating.builder()
                .member(owner)
                .movieId(550L)
                .score(5)
                .build();
        when(ratingRepository.findById(ratingId)).thenReturn(Optional.of(rating));

        ApiException exception = assertThrows(ApiException.class,
                () -> ratingService.update(requesterId, ratingId, request));

        assertThat(exception.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(exception.getCode()).isEqualTo("RATING403_1");
    }
}