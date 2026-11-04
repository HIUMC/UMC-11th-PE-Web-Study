//닉네임 중복 체크 API
// src/main/java/com/umc/movie/service/MemberService.java
package com.umc.movie.service;

import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.entity.Member;

import com.umc.movie.exception.DuplicateMemberException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
//형식 유효성 검사
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.password.PasswordEncoder;


@Service
@RequiredArgsConstructor
public class MemberService {

    //DB 조회
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    //조회용 트랜잭션
    @Transactional(readOnly = true)
    public NicknameCheckResponse checkNickname(String nickname) {
        //닉네임 길이 검사
        if (nickname == null || nickname.length() < 2 || nickname.length() > 12) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "닉네임은 2~12자여야 합니다."
            );
        }
        //닉네임이 DB에 존재하면 true, 없으면 false
        boolean exists = memberRepository.existsByNickname(nickname);
        //사용 가능 여부를 응답 DTO에 담아서 반환함(DB에 있으면 true인데, 반전시킴)
        return new NicknameCheckResponse(!exists);
    }

    @Transactional(readOnly = true)
    public EmailCheckResponse checkEmail(String email) {
        //정규표현식으로 확인
        if (email == null || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "올바른 이메일 형식이 아닙니다."
            );
        }
        //이메일이 DB에 존재하면 true, 없으면 false
        boolean exists = memberRepository.existsByEmail(email);
        //중복 여부를 응답 DTO에 담아서 반환함(DB에 있으면 true인데, 반전시킴)
        return new EmailCheckResponse(!exists);
    }

    public MemberResponse signUp(SignUpRequest request) {
        //이미 가입된 이메일이면 여기서 가입 중단 후 이메일 중복 코드 전달
        if (memberRepository.existsByEmail(request.email())) {
            throw new DuplicateMemberException("MEMBER4091", "이미 사용중인 이메일 입니다.");
        }
        //이메일이 사용 가능하면 닉네임도 확인하고, 중복이면 별도 코드 전달
        if (memberRepository.existsByNickname(request.nickname())) {
            throw new DuplicateMemberException(
                    "MEMBER4092", "이미 사용 중인 닉네임입니다."
            );
        }

        Member member = Member.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .build();

        Member savedMember = memberRepository.save(member);
        return new MemberResponse(savedMember.getMemberId(), savedMember.getEmail(), savedMember.getNickname());

    }
}


