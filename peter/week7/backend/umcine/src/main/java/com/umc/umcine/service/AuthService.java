package com.umc.umcine.service;

import com.umc.umcine.dto.LoginRequest;
import com.umc.umcine.dto.LoginResponse;
import com.umc.umcine.entity.Member;
import com.umc.umcine.exception.ApiException;
import com.umc.umcine.repository.MemberRepository;
import com.umc.umcine.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
                .orElseThrow(() -> new ApiException(
                        HttpStatus.UNAUTHORIZED,
                        "AUTH401_1",
                        "이메일 또는 비밀번호가 올바르지 않습니다."
                ));

        if (!passwordEncoder.matches(
                request.password(),
                member.getPassword()
        )) {
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "AUTH401_1",
                    "이메일 또는 비밀번호가 올바르지 않습니다."
            );
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