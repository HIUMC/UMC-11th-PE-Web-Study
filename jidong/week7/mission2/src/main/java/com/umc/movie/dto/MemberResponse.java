package com.umc.movie.dto;

// 엔티티를 그대로 돌려주면 password까지 나가서 필요한 값만 옮겨 담음
public record MemberResponse(
        Long memberId,
        String email,
        String nickname
) {}
