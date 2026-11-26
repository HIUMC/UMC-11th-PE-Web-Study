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
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {
    @Mock RatingRepository ratings;
    @Mock MemberRepository members;
    @InjectMocks RatingService service;

    @Test
    @DisplayName("같은 영화에 평점을 중복 등록하면 409/RATING409_1이며 저장하지 않는다")
    void duplicateRatingReturnsConflictWithoutSaving() {
        var member = Member.builder().email("owner@test.com").nickname("owner").password("hash").build();
        when(members.findById(1L)).thenReturn(Optional.of(member));
        when(ratings.existsByMember_MemberIdAndMovieId(1L, 550L)).thenReturn(true);

        assertThatThrownBy(() -> service.create(1L, new CreateRatingRequest(550L, 5, "great")))
                .isInstanceOfSatisfying(ApiException.class, error -> {
                    assertThat(error.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(error.getCode()).isEqualTo("RATING409_1");
                });
        verify(ratings, never()).save(any());
    }

    @Test
    @DisplayName("남의 평점을 수정하면 403/RATING403_1이며 원래 점수와 후기가 유지된다")
    void updatingAnotherMembersRatingReturnsForbiddenWithoutMutation() {
        var owner = Member.builder().email("owner@test.com").nickname("owner").password("hash").build();
        ReflectionTestUtils.setField(owner, "memberId", 1L);
        var rating = Rating.builder().member(owner).movieId(550L).score(5).comment("original").build();
        when(ratings.findById(10L)).thenReturn(Optional.of(rating));

        assertThatThrownBy(() -> service.update(2L, 10L, new UpdateRatingRequest(1, "changed")))
                .isInstanceOfSatisfying(ApiException.class, error -> {
                    assertThat(error.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(error.getCode()).isEqualTo("RATING403_1");
                });
        assertThat(rating.getScore()).isEqualTo(5);
        assertThat(rating.getComment()).isEqualTo("original");
        verify(ratings, never()).save(any());
    }
}
