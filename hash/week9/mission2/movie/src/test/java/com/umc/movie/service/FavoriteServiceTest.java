package com.umc.movie.service;

import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.BusinessException;
import com.umc.movie.exception.ErrorCode;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {
    @Mock FavoriteRepository favoriteRepository;
    @Mock MemberRepository memberRepository;
    @InjectMocks FavoriteService favoriteService;

    private final Member member = new Member("fixture@example.com", "test-only", "테스트");

    @Test
    @DisplayName("미등록 영화는 인증된 회원의 즐겨찾기로 저장한다")
    void createFavorite() {
        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(false);
        given(favoriteRepository.saveAndFlush(any(Favorite.class))).willAnswer(call -> call.getArgument(0));

        var response = favoriteService.create(1L, 550L);

        assertThat(response.movieId()).isEqualTo(550L);
        verify(favoriteRepository).saveAndFlush(argThat(f -> f.getMember() == member && f.getMovieId() == 550L));
    }

    @Test
    @DisplayName("중복 즐겨찾기는 FAVORITE409_1을 던지고 저장하지 않는다")
    void rejectsDuplicateFavorite() {
        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        assertThatThrownBy(() -> favoriteService.create(1L, 550L))
                .isInstanceOfSatisfying(BusinessException.class,
                        e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.DUPLICATE_FAVORITE));
        verify(favoriteRepository, never()).saveAndFlush(any());
    }
}
