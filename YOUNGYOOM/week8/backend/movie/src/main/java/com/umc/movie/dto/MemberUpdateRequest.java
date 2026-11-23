package com.umc.movie.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


//내정보 수정 요청에서 받을 값 정의 DTO
public record MemberUpdateRequest(
        // null, 빈 문자열, 공백으로만 이루어진 문자열을 거부
        @NotBlank(message = "닉네임을 입력해주세요.")

        // 닉네임 길이가 2자 이상 12자 이하인지 확인
        @Size(min = 2, max = 12, message = "닉네임은 2자 이상 12자 이하여야 합니다.")
        String nickname
) {
}
