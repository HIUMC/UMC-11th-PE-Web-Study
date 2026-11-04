// src/main/java/com/umc/movie/config/WebConfig.java
package com.umc.movie.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해
                .allowedOrigins("http://localhost:5173", "http://localhost:5174") // 실제 프론트 개발 서버 출처 허용
                .allowedMethods("GET", "POST", "PATCH", "DELETE")
                .allowedHeaders("*");
    }
}
