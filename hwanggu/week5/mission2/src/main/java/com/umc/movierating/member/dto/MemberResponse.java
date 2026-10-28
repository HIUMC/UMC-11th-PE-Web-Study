package com.umc.movierating.member.dto;

import com.umc.movierating.member.Member;

public record MemberResponse(
        Long memberId,
        String nickname,
        String email
) {
    public static MemberResponse from(Member member) {
        return new MemberResponse(
                member.getMemberId(),
                member.getNickname(),
                member.getEmail()
        );
    }
}
