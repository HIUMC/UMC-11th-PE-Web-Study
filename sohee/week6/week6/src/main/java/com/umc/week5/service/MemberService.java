package com.umc.week5.service;

import com.umc.week5.dto.EmailCheckResponse;
import com.umc.week5.dto.MemberResponse;
import com.umc.week5.dto.NicknameCheckResponse;
import com.umc.week5.dto.SignUpRequest;
import com.umc.week5.entity.Member;
import com.umc.week5.exception.ErrorCode;
import com.umc.week5.exception.GeneralException;
import com.umc.week5.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public NicknameCheckResponse checkNickname(String nickname) {
        return new NicknameCheckResponse(!memberRepository.existsByNickname(nickname));
    }

    @Transactional(readOnly = true)
    public EmailCheckResponse checkEmail(String email) {
        return new EmailCheckResponse(!memberRepository.existsByEmail(email));
    }

    @Transactional
    public MemberResponse signUp(SignUpRequest request) {
        if (memberRepository.existsByEmail(request.email())) {
            throw new GeneralException(ErrorCode.DUPLICATE_EMAIL);
        }
        if (memberRepository.existsByNickname(request.nickname())) {
            throw new GeneralException(ErrorCode.DUPLICATE_NICKNAME);
        }

        Member member = Member.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password())) // bcrypt 해시로 저장
                .nickname(request.nickname())
                .build();

        Member savedMember = memberRepository.save(member);
        // 응답 DTO에는 password 필드 자체가 없습니다.
        return new MemberResponse(savedMember.getMemberId(), savedMember.getEmail(), savedMember.getNickname());
    }
}
