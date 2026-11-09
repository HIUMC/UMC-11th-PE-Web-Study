package com.umc.movie.dto;

// 엔티티를 그대로 돌려주면 password까지 나가므로 필요한 값만 옮겨 담습니다.
public record MemberResponse(
        Long memberId,
        String email,
        String nickname
) {}
