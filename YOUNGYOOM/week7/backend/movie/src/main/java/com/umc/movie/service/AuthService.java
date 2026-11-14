package com.umc.movie.service;

import com.umc.movie.dto.login.LoginRequest;
import com.umc.movie.dto.login.LoginResponse;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    //이메일로 DB에서 회원 조회
    private final MemberRepository memberRepository;

    //회원가입 시 비밀번호 해시할때 사용한 빈
    //로그인때는 입력 비밀번호가 DB에 저장된 해시와 일치하는지 확인
    private final PasswordEncoder passwordEncoder;

    //이메일과 비밀번호 검증을 통과한 회원에게 JWT를 발급할 때 사용
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        //1. 로그인 요청에 담긴 이메일로 회원 조회
        //findByEmail() : 조회 결과를 Optional(Member)로 돌려줌
        //회원이 있으면 꺼내고, 아니면 예외를 던져서 로그인 중단
        Member member = memberRepository.findByEmail(request.email()).orElseThrow(() -> new ApiException(
                //401 Unauthorized : 로그인에 필요한 인증 실패
                HttpStatus.UNAUTHORIZED,
                //AUTH401_1 : 이 프로젝트에서 사용하는 로그인 실패 코드
                "AUTH401_1",
                //비번이 틀렸을때와 같은 메시지 반환
                "이메일 또는 비밀번호가 올바르지 않습니다."
        ));

        //2. 사용자가 입력한 비번과 DB에 저장된 비번 해시 검증
        //입력한 비번을 해시 후 저장된 해시와 대조
        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED,//AUTH401_1 : 이 프로젝트에서 사용하는 로그인 실패 코드
                    "AUTH401_1",
                    "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        //3. 회원 조회와 비번 검증에 성공시 accesstoken 발급
        //JwtUtil에 회원 ID와 이메일 전달하고, 발급된 JWT를 문자열로 받음
        String accessToken = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());

        //닉넴과 accesstoken을 로그인 응답 DTO에 담아 컨트롤러에 반환
        return new LoginResponse(member.getNickname(), accessToken);
    }
}
