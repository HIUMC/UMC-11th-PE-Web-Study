package com.umc.movie.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

//비밀번호 해싱에 사용할 객체를 설정하는 클래스
@Configuration
public class PasswordConfig {
    //서비스에서 passwordEncoder을 주입받아서 사용할 수 있도록 빈으로 등ㄹ록
    @Bean
    public PasswordEncoder passwordEncoder() {
        //BCrypt를 사용해 비밀번호를 해싱하고, 입력값이 저장된 해시와 일치하는지 검사
        return new BCryptPasswordEncoder();
    }
}
