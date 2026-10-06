package com.umc.study.dto;

public record ErrorResponse(
        int status,
        String message
) {}
