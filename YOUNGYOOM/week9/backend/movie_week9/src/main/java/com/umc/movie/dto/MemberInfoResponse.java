package com.umc.movie.dto;

//내정보조회 API 만들기

import com.umc.movie.entity.Member;

import java.time.LocalDateTime;

public record MemberInfoResponse(
        String email,
        String nickname,
        LocalDateTime createAt //회원 생성된 날짜와 시간
) {
    //DB에서 조회한 Member 엔티티 값을 응답 DTO로 옮김
    //응답에 필요한 세 필드만 담으므로 저장된 비번 해시는 응답 포함 안됨
    public static MemberInfoResponse from(Member member) {
        return new MemberInfoResponse(
                member.getEmail(),
                member.getNickname(),
                member.getCreatedAt()
        );
    }


}
