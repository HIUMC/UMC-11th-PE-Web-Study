package com.umc.umcine.service;

import com.umc.umcine.dto.LoginRequest;
import com.umc.umcine.dto.LoginResponse;
import com.umc.umcine.entity.Member;
import com.umc.umcine.exception.ApiException;
import com.umc.umcine.exception.AuthErrorCode;
import com.umc.umcine.repository.MemberRepository;
import com.umc.umcine.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.email())
                .orElseThrow(() -> new ApiException(AuthErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(
                request.password(),
                member.getPassword()
        )) {
            throw new ApiException(AuthErrorCode.INVALID_CREDENTIALS);
        }

        String accessToken = jwtUtil.createAccessToken(
                member.getMemberId(),
                member.getEmail()
        );

        return new LoginResponse(
                member.getNickname(),
                accessToken
        );
    }
}