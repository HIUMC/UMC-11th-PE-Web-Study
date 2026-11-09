package com.umc.week5.dto;

public record MemberResponse(
        Long memberId,
        String email,
        String nickname
) {}
