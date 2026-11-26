// src/main/java/com/umc/movie/dto/MemberUpdateRequest.java
package com.umc.movie.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MemberUpdateRequest(

        @NotBlank(message = "닉네임을 입력해주세요.")
        @Size(min = 2, max = 12, message = "닉네임은 2자 이상 12자 이하여야 합니다.")
        @Schema(description = "닉네임 (2~12자)", example = "영화조아")
        String nickname
) {
}
