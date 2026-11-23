package com.umc.movie.service;

import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
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
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private FavoriteService favoriteService;

    @Test
    void create_savesFavoriteWhenNotDuplicate() {
        Member member = Member.builder()
                .email("user@umcine.com")
                .password("encoded")
                .nickname("유저")
                .build();
        ReflectionTestUtils.setField(member, "memberId", 1L);

        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).thenReturn(false);
        when(favoriteRepository.save(any(Favorite.class))).thenAnswer(invocation -> {
            Favorite saved = invocation.getArgument(0);
            ReflectionTestUtils.setField(saved, "favoriteId", 10L);
            return saved;
        });

        FavoriteResponse response = favoriteService.create(1L, new CreateFavoriteRequest(550L));

        assertThat(response.favoriteId()).isEqualTo(10L);
        assertThat(response.movieId()).isEqualTo(550L);
    }

    @Test
    void create_throwsConflictWhenAlreadyFavorited() {
        Member member = Member.builder()
                .email("user@umcine.com")
                .password("encoded")
                .nickname("유저")
                .build();
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).thenReturn(true);

        assertThatThrownBy(() -> favoriteService.create(1L, new CreateFavoriteRequest(550L)))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> {
                    ApiException apiException = (ApiException) ex;
                    assertThat(apiException.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(apiException.getCode()).isEqualTo("FAVORITE409_1");
                });

        verify(favoriteRepository, never()).save(any());
    }

    @Test
    void getMyFavorites_returnsOrderedList() {
        Member member = Member.builder()
                .email("user@umcine.com")
                .password("encoded")
                .nickname("유저")
                .build();
        Favorite newer = Favorite.builder().member(member).movieId(238L).build();
        ReflectionTestUtils.setField(newer, "favoriteId", 2L);
        Favorite older = Favorite.builder().member(member).movieId(550L).build();
        ReflectionTestUtils.setField(older, "favoriteId", 1L);

        when(favoriteRepository.findByMember_MemberIdOrderByFavoriteIdDesc(1L))
                .thenReturn(List.of(newer, older));

        List<FavoriteResponse> favorites = favoriteService.getMyFavorites(1L);

        assertThat(favorites).extracting(FavoriteResponse::favoriteId).containsExactly(2L, 1L);
        assertThat(favorites).extracting(FavoriteResponse::movieId).containsExactly(238L, 550L);
    }

    @Test
    void getStatus_returnsTrueAndFalse() {
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).thenReturn(true);
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 999L)).thenReturn(false);

        FavoriteStatusResponse favorited = favoriteService.getStatus(1L, 550L);
        FavoriteStatusResponse notFavorited = favoriteService.getStatus(1L, 999L);

        assertThat(favorited.isFavorite()).isTrue();
        assertThat(notFavorited.isFavorite()).isFalse();
    }

    @Test
    void delete_deletesExistingFavoriteOrThrowsNotFound() {
        Member member = Member.builder()
                .email("user@umcine.com")
                .password("encoded")
                .nickname("유저")
                .build();
        Favorite favorite = Favorite.builder().member(member).movieId(550L).build();

        when(favoriteRepository.findByMember_MemberIdAndMovieId(1L, 550L))
                .thenReturn(Optional.of(favorite));
        when(favoriteRepository.findByMember_MemberIdAndMovieId(1L, 999L))
                .thenReturn(Optional.empty());

        favoriteService.delete(1L, 550L);
        verify(favoriteRepository).delete(favorite);

        assertThatThrownBy(() -> favoriteService.delete(1L, 999L))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> {
                    ApiException apiException = (ApiException) ex;
                    assertThat(apiException.getStatus()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(apiException.getCode()).isEqualTo("FAVORITE404_1");
                });
    }
}
