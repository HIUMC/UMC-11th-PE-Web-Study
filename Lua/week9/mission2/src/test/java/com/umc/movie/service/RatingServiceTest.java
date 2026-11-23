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

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
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

    private final Member owner = Member.builder()
            .email("owner@umc.com")
            .password("encoded-password")
            .nickname("owner")
            .build();

    private final Member anotherMember = Member.builder()
            .email("another@umc.com")
            .password("encoded-password")
            .nickname("another")
            .build();

    @Test
    void throwsRating409_1AndDoesNotSaveWhenRatingSameMovieTwice() {
        // given
        given(memberRepository.findById(1L)).willReturn(Optional.of(owner));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        // when / then
        assertThatThrownBy(() -> ratingService.create(1L, new CreateRatingRequest(550L, 5, "great")))
                .isInstanceOfSatisfying(ApiException.class,
                        exception -> assertThat(exception.getCode()).isEqualTo("RATING409_1"));
        verify(ratingRepository, never()).save(any(Rating.class));
    }

    @Test
    void throwsRating403_1WhenTryingToUpdateAnotherMembersRating() {
        // given
        Rating rating = Rating.builder().member(owner).movieId(550L).score(3).comment("before").build();
        given(ratingRepository.findById(10L)).willReturn(Optional.of(rating));

        // when / then
        assertThatThrownBy(() -> ratingService.update(2L, 10L, new UpdateRatingRequest(5, "after")))
                .isInstanceOfSatisfying(ApiException.class,
                        exception -> assertThat(exception.getCode()).isEqualTo("RATING403_1"));
        verify(ratingRepository, never()).save(any(Rating.class));
    }
}
