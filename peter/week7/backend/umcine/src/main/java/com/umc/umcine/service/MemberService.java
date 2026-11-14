package com.umc.umcine.service;

import com.umc.umcine.dto.EmailCheckResponse;
import com.umc.umcine.dto.NicknameCheckResponse;
import com.umc.umcine.repository.MemberRepository;
import com.umc.umcine.dto.MemberResponse;
import com.umc.umcine.dto.SignUpRequest;
import com.umc.umcine.entity.Member;
import com.umc.umcine.exception.MemberConflictException;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.umc.umcine.dto.MemberInfoResponse;
import com.umc.umcine.exception.ApiException;
import org.springframework.http.HttpStatus;
import com.umc.umcine.dto.MemberUpdateRequest;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public MemberResponse signUp(SignUpRequest request) {
        // 1. 이메일 중복 확인
        if (memberRepository.existsByEmail(request.email())) {
            throw MemberConflictException.duplicateEmail();
        }

        // 2. 닉네임 중복 확인
        if (memberRepository.existsByNickname(request.nickname())) {
            throw MemberConflictException.duplicateNickname();
        }

        // 3. 비밀번호를 해시하고 엔티티 생성
        Member member = new Member(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.nickname()
        );

        // 4. DB에 저장
        Member savedMember = memberRepository.save(member);

        // 5. 비밀번호를 제외한 응답 반환
        return new MemberResponse(
                savedMember.getMemberId(),
                savedMember.getEmail(),
                savedMember.getNickname()
        );
    }

    @Transactional(readOnly = true)
    public NicknameCheckResponse checkNickname(String nickname) {
        boolean exists = memberRepository.existsByNickname(nickname);
        return new NicknameCheckResponse(!exists);
    }

    @Transactional(readOnly = true)
    public EmailCheckResponse checkEmail(String email) {
        boolean exists = memberRepository.existsByEmail(email);
        return new EmailCheckResponse(!exists);
    }

    @Transactional(readOnly = true)
    public MemberInfoResponse getMyInfo(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."
                ));

        return MemberInfoResponse.from(member);
    }

    @Transactional
    public MemberInfoResponse updateMyInfo(
            Long memberId,
            MemberUpdateRequest request
    ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."
                ));

        if (memberRepository.existsByNicknameAndMemberIdNot(
                request.nickname(),
                memberId
        )) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "MEMBER409_1",
                    "이미 사용 중인 닉네임입니다."
            );
        }

        member.updateNickname(request.nickname());

        return MemberInfoResponse.from(member);
    }

}
