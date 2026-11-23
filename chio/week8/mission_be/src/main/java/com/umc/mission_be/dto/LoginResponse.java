package com.umc.mission_be.dto;


public record LoginResponse(
        String nickname,
        String accessToken
) {
}