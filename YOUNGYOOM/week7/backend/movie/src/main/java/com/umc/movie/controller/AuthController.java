package com.umc.movie.controller;

import com.umc.movie.dto.login.LoginRequest;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.login.LoginResponse;
import com.umc.movie.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//HTTP 요청 처리 컨트롤러로 등록
//반환한 응답 객체는 Spring이 JSON으로 변환하 클라이언트에 보냄
@RestController
//이 컨트롤러 내 API 경로의 공통 앞부분을 /auth로 지정
@RequestMapping("/auth")
//Lombok이 AuthService를 받는 생성자를 만들고 스프링이 이 생성자를 통해 AuthService 주입
@RequiredArgsConstructor
public class AuthController {
    //회원조회, 비번거증, 토큰 발급 서비스
    private final AuthService authService;

    //클래스의 /auth와 메서드의 /login이 합쳐져 POST /auth/login 요청 처리
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            //@RequestBody 는 요청 본문의 JSON을 LoginRequest 객체로 반환
            //@Valid는 LoginRequest에 선언된 입력 제약 조건 검사
            //입력값 검증 실패시 이 메서드가 실행되기 전에 예외 발생
            @RequestBody @Valid LoginRequest request
    ) {
        //검증 통과 요청을 서비스에 전달
        //로그인 성공 시 닉네임과 토큰 담긴 LoginResponse를 받음
        LoginResponse response = authService.login(request);

        //ApiResponse.ok() : 성공 메시지와 로그인 결과를 공통 응답ㅎ ㅕㅇ식으로 감쌈
        //ResponseEntity.ok() : 그 객체를 응답 본문에 담고 HTTP 상태를 200ok로 설정
        return ResponseEntity.ok(ApiResponse.ok("로그인에 성공했습니다.", response));
    }

}
