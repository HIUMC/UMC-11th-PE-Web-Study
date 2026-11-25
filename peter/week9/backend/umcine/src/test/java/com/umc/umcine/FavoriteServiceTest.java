package com.umc.umcine;

import com.umc.umcine.dto.CreateFavoriteRequest;
import com.umc.umcine.dto.FavoriteResponse;
import com.umc.umcine.entity.Favorite;
import com.umc.umcine.entity.Member;
import com.umc.umcine.exception.ApiException;
import com.umc.umcine.exception.FavoriteErrorCode;
import com.umc.umcine.repository.FavoriteRepository;
import com.umc.umcine.repository.MemberRepository;
import com.umc.umcine.service.FavoriteService;
import org.junit.jupiter.api.DisplayName;
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
@DisplayName("즐겨찾기 서비스 단위 테스트")
class FavoriteServiceTest {
    @Mock private FavoriteRepository favoriteRepository;
    @Mock private MemberRepository memberRepository;
    @InjectMocks private FavoriteService favoriteService;

    private final Member member = new Member("challenger@umc.com", "hash", "영화조아");

    @Test
    @DisplayName("아직 즐겨찾기하지 않은 영화면 저장하고 영화 ID를 반환한다")
    void createFavorite() {
        // given
        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(false);
        given(favoriteRepository.save(any(Favorite.class)))
                .willReturn(Favorite.builder().member(member).movieId(550L).build());

        // when
        FavoriteResponse response = favoriteService.create(1L, new CreateFavoriteRequest(550L));

        // then
        assertThat(response.movieId()).isEqualTo(550L);
        verify(favoriteRepository).save(any(Favorite.class));
    }

    @Test
    @DisplayName("이미 즐겨찾기한 영화면 FAVORITE409_1 예외를 던지고 저장하지 않는다")
    void createFavoriteWhenDuplicated() {
        // given
        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> favoriteService.create(1L, new CreateFavoriteRequest(550L)))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getErrorCode()).isEqualTo(FavoriteErrorCode.DUPLICATE_FAVORITE);
                    assertThat(exception.getCode()).isEqualTo("FAVORITE409_1");
                });
        verify(favoriteRepository, never()).save(any(Favorite.class));
    }
}
