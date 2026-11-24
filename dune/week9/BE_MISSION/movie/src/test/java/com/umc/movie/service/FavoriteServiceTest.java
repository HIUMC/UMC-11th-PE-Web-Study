package com.umc.movie.service;

import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
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
class FavoriteServiceTest {
    private static final long MEMBER_ID = 1L;
    private static final long MOVIE_ID = 550L;

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private FavoriteService favoriteService;

    @BeforeEach
    void setUp() {
        Member member = Member.builder().email("challenger@umc.com").nickname("영화조아").build();
        given(memberRepository.findById(MEMBER_ID)).willReturn(Optional.of(member));
    }

    @Test
    void savesNewFavorite() {
        given(favoriteRepository.save(any(Favorite.class))).willAnswer(invocation -> invocation.getArgument(0));

        FavoriteResponse response = favoriteService.create(MEMBER_ID, new CreateFavoriteRequest(MOVIE_ID));

        assertThat(response.movieId()).isEqualTo(MOVIE_ID);
        verify(favoriteRepository).save(any(Favorite.class));
    }

    @Test
    void rejectsDuplicateFavoriteWithoutSaving() {
        given(favoriteRepository.existsByMember_MemberIdAndMovieId(MEMBER_ID, MOVIE_ID)).willReturn(true);

        assertThatThrownBy(() -> favoriteService.create(MEMBER_ID, new CreateFavoriteRequest(MOVIE_ID)))
                .isInstanceOfSatisfying(ApiException.class,
                        exception -> assertThat(exception.getCode()).isEqualTo("FAVORITE409_1"));
        verify(favoriteRepository, never()).save(any(Favorite.class));
    }
}
