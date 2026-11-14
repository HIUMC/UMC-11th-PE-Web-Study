//src/main/java/com/umc/movie/config/WebConfig.java
//Cors 오류 설정 적용
package com.umc.movie.config;

import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.resolver.LoginMemberArgumentResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;


@Configuration
//Lombok이 authInterceptor를 받는 생성자 만듦
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    //Spring에 등록된 인터셉터 빈을 주입받음
    //아래 addInterceptor()에서 이 빈을 MVC 요청 처리에 연결
    private final AuthInterceptor authInterceptor;
    private final LoginMemberArgumentResolver loginMemberArgumentResolver;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT")
                .allowedHeaders("*");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //JWT 인증 담당 인터셉터를 Spring MVC에 등록
        registry.addInterceptor(authInterceptor)
                //일단 모든 경로를 인터셉터 적용 대상으로 지정
                .addPathPatterns("/**")
                //아래 URL 경로들은 이 인터셉터의 토큰 검사를 건너뜀
                .excludePathPatterns(
                        "/auth/**",             // /auth/login을 포함한 /auth 하위 경로
                        "/members",             // 회원가입에 사용하는 /members 경로
                        "/members/nickname/**", // 닉네임 중복 확인 경로
                        "/members/email/**",    // 이메일 중복 확인 경로
                        "/members/*/ratings",   // 예: /members/1/ratings
                        "/error"
                );// Spring의 오류 응답 처리 경로)
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(loginMemberArgumentResolver);
    }
}