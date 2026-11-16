package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.MemberUpdateRequest;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.exception.DuplicateException;
import com.umc.movie.exception.DuplicateType;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

class ServiceRuleTest {

    private final MemberRepository memberRepository = mock(MemberRepository.class);
    private final RatingRepository ratingRepository = mock(RatingRepository.class);
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final MemberService memberService = new MemberService(memberRepository, encoder);
    private final RatingService ratingService = new RatingService(ratingRepository, memberRepository);

    private final SignUpRequest signUpRequest = new SignUpRequest("a@b.com", "Test1234!", "tester");

    private Rating ratingOwnedBy(long memberId) {
        Member owner = Member.builder().email("o@b.com").password("x").nickname("owner").build();
        ReflectionTestUtils.setField(owner, "memberId", memberId);
        return Rating.builder().member(owner).movieId(1L).score(3).comment("c").build();
    }

    @Test
    void signUpStoresBcryptHash() {
        given(memberRepository.save(any(Member.class))).willAnswer(invocation -> invocation.getArgument(0));

        MemberResponse response = memberService.signUp(signUpRequest);

        assertThat(response.email()).isEqualTo("a@b.com");
        org.mockito.ArgumentCaptor<Member> saved = org.mockito.ArgumentCaptor.forClass(Member.class);
        verify(memberRepository).save(saved.capture());
        assertThat(saved.getValue().getPassword()).startsWith("$2").hasSize(60);
        assertThat(encoder.matches("Test1234!", saved.getValue().getPassword())).isTrue();
    }

    @Test
    void duplicateEmailAndNicknameAreDistinguished() {
        given(memberRepository.existsByEmail("a@b.com")).willReturn(true);
        assertThatThrownBy(() -> memberService.signUp(signUpRequest))
                .isInstanceOf(DuplicateException.class)
                .hasFieldOrPropertyWithValue("type", DuplicateType.EMAIL);

        given(memberRepository.existsByEmail("a@b.com")).willReturn(false);
        given(memberRepository.existsByNickname("tester")).willReturn(true);
        assertThatThrownBy(() -> memberService.signUp(signUpRequest))
                .isInstanceOf(DuplicateException.class)
                .hasFieldOrPropertyWithValue("type", DuplicateType.NICKNAME);

        verify(memberRepository, never()).save(any());
    }

    @Test
    void duplicateRatingIsNotSaved() {
        given(memberRepository.findById(1L)).willReturn(Optional.of(mock(Member.class)));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 1L)).willReturn(true);

        assertThatThrownBy(() -> ratingService.create(1L, new CreateRatingRequest(1L, 5, "c")))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("code", "RATING409_1");

        verify(ratingRepository, never()).save(any());
    }

    @Test
    void otherMembersRatingIsForbidden() {
        given(ratingRepository.findById(10L)).willReturn(Optional.of(ratingOwnedBy(2L)));

        assertThatThrownBy(() -> ratingService.update(1L, 10L, new UpdateRatingRequest(4, "c")))
                .isInstanceOfSatisfying(ApiException.class, e -> {
                    assertThat(e.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(e.getCode()).isEqualTo("RATING403_1");
                });
        assertThatThrownBy(() -> ratingService.delete(1L, 10L))
                .isInstanceOfSatisfying(ApiException.class,
                        e -> assertThat(e.getCode()).isEqualTo("RATING403_1"));

        verify(ratingRepository, never()).delete(any());
    }

    @Test
    void missingRatingIsNotFound() {
        given(ratingRepository.findById(10L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> ratingService.delete(1L, 10L))
                .isInstanceOfSatisfying(ApiException.class, e -> {
                    assertThat(e.getStatus()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(e.getCode()).isEqualTo("RATING404_1");
                });
    }

    @Test
    void ownerCanUpdateAndDelete() {
        Rating rating = ratingOwnedBy(1L);
        given(ratingRepository.findById(10L)).willReturn(Optional.of(rating));

        ratingService.update(1L, 10L, new UpdateRatingRequest(4, "new"));
        assertThat(rating.getScore()).isEqualTo(4);
        assertThat(rating.getComment()).isEqualTo("new");

        ratingService.delete(1L, 10L);
        verify(ratingRepository).delete(rating);
    }

    @Test
    void nicknameUpdateAllowsOwnNicknameButBlocksOthers() {
        Member me = Member.builder().email("a@b.com").password("x").nickname("영화광").build();
        ReflectionTestUtils.setField(me, "memberId", 1L);
        given(memberRepository.findById(1L)).willReturn(Optional.of(me));

        // 내가 쓰고 있는 닉네임 그대로 보내는 건 중복이 아닙니다
        given(memberRepository.existsByNicknameAndMemberIdNot("영화광", 1L)).willReturn(false);
        assertThat(memberService.updateMyInfo(1L, new MemberUpdateRequest("영화광")).nickname()).isEqualTo("영화광");

        // 다른 회원이 쓰는 닉네임이면 409
        given(memberRepository.existsByNicknameAndMemberIdNot("taken", 1L)).willReturn(true);
        assertThatThrownBy(() -> memberService.updateMyInfo(1L, new MemberUpdateRequest("taken")))
                .isInstanceOfSatisfying(ApiException.class, e -> {
                    assertThat(e.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(e.getCode()).isEqualTo("MEMBER409_1");
                });
        assertThat(me.getNickname()).isEqualTo("영화광");
    }

    @Test
    void missingMemberIsNotFound() {
        given(memberRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> memberService.getMyInfo(99L))
                .isInstanceOfSatisfying(ApiException.class,
                        e -> assertThat(e.getCode()).isEqualTo("MEMBER404_1"));
    }
}
