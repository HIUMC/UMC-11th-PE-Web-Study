package com.umc.umcine.dto;

public record LoginResponse(
        String nickname,
        String accessToken
) {
}