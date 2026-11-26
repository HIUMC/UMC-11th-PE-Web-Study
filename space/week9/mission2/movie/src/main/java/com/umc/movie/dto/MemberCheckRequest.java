package com.umc.movie.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MemberCheckRequest(
        @NotBlank @Size(max = 50) String nickname,
        @NotBlank @Email @Size(max = 254) String email
) {}
