package com.umc.movierating.member;

import com.umc.movierating.member.dto.AvailabilityResponse;
import com.umc.movierating.member.dto.MemberResponse;
import com.umc.movierating.member.dto.SignUpRequest;
import com.umc.movierating.rating.RatingService;
import com.umc.movierating.rating.dto.RatingResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final RatingService ratingService;

    // 회원 가입
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MemberResponse signUp(@Valid @RequestBody SignUpRequest request) {
        return memberService.signUp(request);
    }

    // 닉네임 중복 확인
    @GetMapping("/check-nickname")
    public AvailabilityResponse checkNickname(@RequestParam String nickname) {
        return AvailabilityResponse.of(memberService.isNicknameAvailable(nickname));
    }

    // 이메일 중복 확인
    @GetMapping("/check-email")
    public AvailabilityResponse checkEmail(@RequestParam String email) {
        return AvailabilityResponse.of(memberService.isEmailAvailable(email));
    }

    // 특정 회원이 남긴 평점 목록
    @GetMapping("/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(@PathVariable Long memberId) {
        return ratingService.getRatingsByMember(memberId);
    }
}
