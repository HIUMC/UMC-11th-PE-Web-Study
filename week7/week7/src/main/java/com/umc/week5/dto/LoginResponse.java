package com.umc.week5.dto;

public record LoginResponse(
        String nickname,
        String accessToken
) {
}
