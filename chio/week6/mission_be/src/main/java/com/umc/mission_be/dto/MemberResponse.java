package com.umc.mission_be.dto;



public record MemberResponse(
        Long memberId,
        String email,
        String nickname
) {}