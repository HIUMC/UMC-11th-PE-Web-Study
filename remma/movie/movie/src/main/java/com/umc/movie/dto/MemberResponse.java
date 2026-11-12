// src/main/java/com/umc/movie/dto/MemberResponse.java
package com.umc.movie.dto;

import com.umc.movie.entity.Member;

import java.time.LocalDateTime;

public record MemberResponse(
        Long memberId,
        String email,
        String nickname,
        LocalDateTime createdAt
) {
    public static MemberResponse from(Member member) {
        return new MemberResponse(
                member.getMemberId(),
                member.getEmail(),
                member.getNickname(),
                member.getCreatedAt()
        );
    }
}
