// src/main/java/com/umc/movie/dto/MemberUpdateRequest.java
package com.umc.movie.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * 닉네임만 변경, 비밀번호만 변경, 또는 둘 다 변경할 수 있도록 각 필드를 선택적으로 받습니다.
 * 값이 전달된 필드에 대해서만 형식을 검증합니다.
 */
public record MemberUpdateRequest(
        @Size(min = 2, max = 12, message = "닉네임은 2자 이상 12자 이하로 입력해주세요.")
        String nickname,

        String currentPassword,

        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$",
                message = "비밀번호는 대문자/소문자/숫자/특수문자를 포함한 8자 이상이어야 합니다."
        )
        String newPassword
) {}
