package com.umc.movie.service;

import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MovieRecordServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private FavoriteRepository favoriteRepository;

    @InjectMocks
    private MovieRecordService movieRecordService;

    @Test
    void create_savesRatingAndFavoriteWhenAddToFavoritesIsTrue() {
        Member member = Member.builder()
                .email("user@umcine.com")
                .password("encoded")
                .nickname("유저")
                .build();
        ReflectionTestUtils.setField(member, "memberId", 1L);

        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 238L)).thenReturn(false);
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 238L)).thenReturn(false);
        when(ratingRepository.save(any(Rating.class))).thenAnswer(invocation -> {
            Rating saved = invocation.getArgument(0);
            ReflectionTestUtils.setField(saved, "ratingId", 3L);
            return saved;
        });
        when(favoriteRepository.save(any(Favorite.class))).thenAnswer(invocation -> {
            Favorite saved = invocation.getArgument(0);
            ReflectionTestUtils.setField(saved, "favoriteId", 2L);
            return saved;
        });

        MovieRecordResponse response = movieRecordService.create(
                1L,
                new CreateMovieRecordRequest(238L, 5, "다시 보고 싶은 영화입니다.", true)
        );

        assertThat(response.rating().ratingId()).isEqualTo(3L);
        assertThat(response.rating().score()).isEqualTo(5);
        assertThat(response.favorite()).isNotNull();
        assertThat(response.favorite().favoriteId()).isEqualTo(2L);
        assertThat(response.favorite().movieId()).isEqualTo(238L);
    }

    @Test
    void create_savesOnlyRatingWhenAddToFavoritesIsFalse() {
        Member member = Member.builder()
                .email("user@umcine.com")
                .password("encoded")
                .nickname("유저")
                .build();
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 238L)).thenReturn(false);
        when(ratingRepository.save(any(Rating.class))).thenAnswer(invocation -> {
            Rating saved = invocation.getArgument(0);
            ReflectionTestUtils.setField(saved, "ratingId", 4L);
            return saved;
        });

        MovieRecordResponse response = movieRecordService.create(
                1L,
                new CreateMovieRecordRequest(238L, 4, "괜찮았어요.", false)
        );

        assertThat(response.rating().ratingId()).isEqualTo(4L);
        assertThat(response.favorite()).isNull();
        verify(favoriteRepository, never()).save(any());
    }

    @Test
    void create_throwsRatingConflictWhenRatingAlreadyExists() {
        Member member = Member.builder()
                .email("user@umcine.com")
                .password("encoded")
                .nickname("유저")
                .build();
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 238L)).thenReturn(true);

        assertThatThrownBy(() -> movieRecordService.create(
                1L,
                new CreateMovieRecordRequest(238L, 5, "중복", true)
        ))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> {
                    ApiException apiException = (ApiException) ex;
                    assertThat(apiException.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(apiException.getCode()).isEqualTo("RATING409_1");
                });

        verify(ratingRepository, never()).save(any());
        verify(favoriteRepository, never()).save(any());
    }

    @Test
    void create_throwsFavoriteConflictWhenFavoriteAlreadyExists() {
        Member member = Member.builder()
                .email("user@umcine.com")
                .password("encoded")
                .nickname("유저")
                .build();
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 238L)).thenReturn(false);
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 238L)).thenReturn(true);

        assertThatThrownBy(() -> movieRecordService.create(
                1L,
                new CreateMovieRecordRequest(238L, 5, "즐겨찾기 중복", true)
        ))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> {
                    ApiException apiException = (ApiException) ex;
                    assertThat(apiException.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(apiException.getCode()).isEqualTo("FAVORITE409_1");
                });

        verify(ratingRepository, never()).save(any());
        verify(favoriteRepository, never()).save(any());
    }
}
