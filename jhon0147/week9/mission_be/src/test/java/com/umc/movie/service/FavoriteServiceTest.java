package com.umc.movie.service;

import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
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
class FavoriteServiceTest {
    @Mock FavoriteRepository favorites;
    @Mock MemberRepository members;
    @InjectMocks FavoriteService favoriteService;

    private final Member member = new Member("favorite@umc.com", "unused", "즐겨회원");

    @Test
    @DisplayName("처음 즐겨찾기한 영화는 저장하고 영화 ID를 반환한다")
    void createFavorite() {
        // given: 존재하는 회원, 미등록 영화
        given(members.findById(1L)).willReturn(Optional.of(member));
        given(favorites.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(false);
        given(favorites.save(any(Favorite.class))).willAnswer(invocation -> invocation.getArgument(0));

        // when
        FavoriteResponse response = favoriteService.create(1L, new CreateFavoriteRequest(550L));

        // then
        assertThat(response.movieId()).isEqualTo(550L);
        verify(favorites).save(org.mockito.ArgumentMatchers.argThat(
                favorite -> favorite.getMember() == member && favorite.getMovieId().equals(550L)));
    }

    @Test
    @DisplayName("중복 즐겨찾기는 409와 FAVORITE409_1 예외를 던지고 저장하지 않는다")
    void createFavoriteWhenDuplicated() {
        // given: 이미 등록한 영화
        given(members.findById(1L)).willReturn(Optional.of(member));
        given(favorites.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> favoriteService.create(1L, new CreateFavoriteRequest(550L)))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(exception.getCode()).isEqualTo("FAVORITE409_1");
                });
        verify(favorites, never()).save(any(Favorite.class));
    }
}
