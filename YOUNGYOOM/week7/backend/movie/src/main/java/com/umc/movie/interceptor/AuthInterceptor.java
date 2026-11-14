package com.umc.movie.interceptor;

import com.umc.movie.exception.ApiException;
import com.umc.movie.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor

public class AuthInterceptor implements HandlerInterceptor {
    //현재 요청에 회원 ID를 저장할때 사용하는 키
    //컨트롤러에서도 이 상수 사용시 저장할때와 꺼낼때 같은 키 사용 가능
    public static final String MEMBER_ID = "memberId";

    //Authorization 헤더에서 JWT 앞에 붙는 접두사
    //Bearer 뒤의 공백까지 포함
    private static final String BEARER_PREFIX = "Bearer ";

    //JWT 검증/토큰에 담긴 회원 ID 꺼낼떄 사용
    private final JwtUtil jwtUtil;

    //이 인터셉터가 적용되는 요청에서 컨트롤러 실행전에 호출됨.
    //true면 요청 처리 지속, 예외 던지면 컨트롤러 실행 전 예외처리 흐름으로 넘어감
    @Override
    public boolean preHandle(
            HttpServletRequest request, //들어온 HTTP 요청의 메서드와 헤더 읽기 가능
            HttpServletResponse response, //필요하면 HTTP 응답 직접 설정 가능
            Object handler //요청 처리할 헨들러
    ) {
        //1. 브라우저가 교차 출처 요청을 보내기전에 OPTIONS로 사전 확인
        //이때 인증 헤더를 사용할 에정이라고 알릴 수 있지만 실제 JWT는 본 요청에 담아 보냄
        //따라서 OPTIONS 요청은 여기서 JWT 검사 없이 통과
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        //2. 클라이언트가 보낸 인증 헤더 값 읽고, 없으면 null
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        //3. 헤더가 없거나 "Bearer "로 시작하지 않을시 401 예외 던짐
        //헤더가 null이면 뒤 함수는 호출 하지 않음
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_2",
                    "로그인이 필요한 요청입니다.");
        }

        //4. substring()으로 앞의 "Bearer "을 떼고 JWT 문자열만 전달함
        //JwtUtil에서 서명과 만료 여부 검증 후 회원 ID 꺼냄
        //검증 실패시 JwtUtil이 예외를 던짐
        Long memberId = jwtUtil.getMemberId(header.substring(BEARER_PREFIX.length()));

        //5. 검증한 회원 ID를 현재 요청의 속성에 저장
        //이후 컨트롤러가 request.getAttribute(AuthInterceptor.Member_ID)로 이 요청 보낸 회원 ID 꺼낼 수 있음
        request.setAttribute(MEMBER_ID, memberId);

        //6. 인증 통과 -> 컨트롤러까지 요청 처리
        return true;
    }
}
