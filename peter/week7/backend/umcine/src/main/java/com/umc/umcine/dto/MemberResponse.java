package com.umc.umcine.dto;

public record MemberResponse(
        Long memberId,
        String email,
        String nickname
) {}