package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RatingServiceTests {
    private RatingRepository ratings;
    private MemberRepository members;
    private RatingService service;

    @BeforeEach
    void setUp() {
        ratings = mock(RatingRepository.class);
        members = mock(MemberRepository.class);
        service = new RatingService(ratings, members);
    }

    private Rating storedRating() {
        Member owner = mock(Member.class);
        when(owner.getMemberId()).thenReturn(101L);
        return Rating.builder().member(owner).movieId(1L).score(3).comment("original").build();
    }

    @Test
    void ownerCanUpdate() {
        Rating rating = storedRating();
        when(ratings.findById(202L)).thenReturn(Optional.of(rating));
        var response = service.update(101L, 202L, new UpdateRatingRequest(5, "updated"));
        assertEquals(5, response.score());
        assertEquals("updated", response.comment());
        verify(ratings).save(rating);
    }

    @Test
    void anotherMemberCannotUpdateOrDelete() {
        Rating rating = storedRating();
        when(ratings.findById(202L)).thenReturn(Optional.of(rating));
        ApiException update = assertThrows(ApiException.class,
                () -> service.update(303L, 202L, new UpdateRatingRequest(1, "forbidden")));
        ApiException delete = assertThrows(ApiException.class,
                () -> service.delete(303L, 202L));
        for (ApiException error : new ApiException[]{update, delete}) {
            assertEquals(HttpStatus.FORBIDDEN, error.getStatus());
            assertEquals("RATING403_1", error.getCode());
        }
        assertEquals(3, rating.getScore());
        assertEquals("original", rating.getComment());
        verify(ratings, never()).save(any(Rating.class));
        verify(ratings, never()).delete(any(Rating.class));
    }

    @Test
    void missingRatingReturnsNotFound() {
        when(ratings.findById(202L)).thenReturn(Optional.empty());
        ApiException error = assertThrows(ApiException.class, () -> service.delete(101L, 202L));
        assertEquals(HttpStatus.NOT_FOUND, error.getStatus());
        assertEquals("RATING404_1", error.getCode());
        verify(ratings, never()).delete(any(Rating.class));
    }

    @Test
    void ownerCanDelete() {
        Rating rating = storedRating();
        when(ratings.findById(202L)).thenReturn(Optional.of(rating));
        service.delete(101L, 202L);
        verify(ratings).delete(rating);
    }

    @Test
    void duplicateMovieRatingIsRejected() {
        when(members.findById(101L)).thenReturn(Optional.of(mock(Member.class)));
        when(ratings.existsByMember_MemberIdAndMovieId(101L, 1L)).thenReturn(true);
        ApiException error = assertThrows(ApiException.class,
                () -> service.create(101L, new CreateRatingRequest(1L, 5, "duplicate")));
        assertEquals(HttpStatus.CONFLICT, error.getStatus());
        assertEquals("RATING409_1", error.getCode());
        verify(ratings, never()).save(any(Rating.class));
    }
}
