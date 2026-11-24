package com.umc.movie.config;


import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//Spring이 이 클래스를 설정 클래스로 인식하도록 지정
@Configuration
public class SwaggerConfig {

    //스웨거 문서에서 JWT 인증 방식 참조시 쓰는 이름
    //컨트롤러에서 @SecurityRequirement(name=SwaggerConfig.BEARER_AUTH)로 연결할 수 있음
    public static final String BEARER_AUTH = "bearerAuth";

    //스웨거 문서에 사용할 OpenAPI 설정 객체를 Spring 빈으로 등록
    @Bean
    public OpenAPI movieOpenAPI() {
        return new OpenAPI()
                //스웨거 UI 상단에 표시할 문서 정보
                .info(new Info()
                        .title("영화 평점 서비스 API")
                        .description("UMC 11기 백엔드 워크북에서 만든 회원/평점/즐겨찾기 API 문서입니다.")
                        .version("v1"))
                .components(new Components()
                        .addSecuritySchemes(BEARER_AUTH, new SecurityScheme()
                                //HTTP 인증 방식 사용
                                .type(SecurityScheme.Type.HTTP)
                                //Swagger UI가 요청에 Authorizaiton : Bearer {토큰} 헤더를 붙임
                                .scheme("bearer")
                                //사용하는 토큰 형식이 JWT임을 문서에 표시
                                .bearerFormat("JWT")));
    }
}
