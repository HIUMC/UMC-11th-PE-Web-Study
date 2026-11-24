package com.umc.movie.service;

import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private FavoriteService favoriteService;

    private final Member member = Member.builder()
            .email("favorite-unit@example.test")
            .password("unused")
            .nickname("단위테스트")
            .build();

    @Test
    void savesFavoriteWhenMovieIsNotAlreadyFavorited() {
        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(false);
        given(favoriteRepository.save(any(Favorite.class))).willAnswer(call -> call.getArgument(0));

        FavoriteResponse response = favoriteService.create(1L, new CreateFavoriteRequest(550L));

        assertThat(response.movieId()).isEqualTo(550L);
        verify(favoriteRepository).save(any(Favorite.class));
    }

    @Test
    void rejectsDuplicateFavoriteBeforeSaving() {
        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        Throwable thrown = catchThrowable(() -> favoriteService.create(1L, new CreateFavoriteRequest(550L)));

        verify(favoriteRepository, never()).save(any(Favorite.class));
        assertThat(thrown).isInstanceOfSatisfying(ApiException.class, error -> {
            assertThat(error.getStatus()).isEqualTo(HttpStatus.CONFLICT);
            assertThat(error.getCode()).isEqualTo("FAVORITE409_1");
        });
    }
}
