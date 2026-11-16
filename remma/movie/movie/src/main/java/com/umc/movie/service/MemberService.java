package com.umc.movie.service;

import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.MemberUpdateRequest;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
        boolean exists = memberRepository.existsByNickname(nickname);
        return new NicknameCheckResponse(!exists);
    }

    @Transactional(readOnly = true)
    public EmailCheckResponse checkEmail(String email) {
        boolean exists = memberRepository.existsByEmail(email);
        return new EmailCheckResponse(!exists);
    }

    @Transactional
    public MemberResponse signUp(SignUpRequest request) {
        if (memberRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        if (memberRepository.existsByNickname(request.nickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        Member member = Member.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .build();

        Member savedMember = memberRepository.save(member);
        return MemberResponse.from(savedMember);
    }

    @Transactional(readOnly = true)
    public MemberResponse getMyInfo(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."));
        return MemberResponse.from(member);
    }

    @Transactional
    public MemberResponse updateMyInfo(Long memberId, MemberUpdateRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."));

        boolean hasNickname = request.nickname() != null && !request.nickname().isBlank();
        boolean hasPasswordChange =
                (request.currentPassword() != null && !request.currentPassword().isBlank())
                        || (request.newPassword() != null && !request.newPassword().isBlank());

        if (!hasNickname && !hasPasswordChange) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "MEMBER400_1", "닉네임을 입력해주세요.");
        }

        if (hasNickname) {
            String trimmedNickname = request.nickname().trim();
            if (memberRepository.existsByNicknameAndMemberIdNot(trimmedNickname, memberId)) {
                throw new ApiException(HttpStatus.CONFLICT, "MEMBER409_1",
                        "이미 사용 중인 닉네임입니다.");
            }
            member.updateNickname(trimmedNickname);
        }

        if (hasPasswordChange) {
            if (request.currentPassword() == null || request.currentPassword().isBlank()
                    || request.newPassword() == null || request.newPassword().isBlank()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "MEMBER400_2",
                        "현재 비밀번호와 새 비밀번호를 모두 입력해주세요.");
            }
            if (!passwordEncoder.matches(request.currentPassword(), member.getPassword())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "MEMBER400_3",
                        "현재 비밀번호가 일치하지 않습니다.");
            }
            if (request.currentPassword().equals(request.newPassword())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "MEMBER400_4",
                        "새 비밀번호는 현재 비밀번호와 달라야 합니다.");
            }
            member.updatePassword(passwordEncoder.encode(request.newPassword()));
        }

        memberRepository.save(member);
        return MemberResponse.from(member);
    }
}
