package com.umc.movie.config;

import com.umc.movie.auth.LoginMemberArgumentResolver;
import com.umc.movie.interceptor.AuthInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.*;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final AuthInterceptor authInterceptor;
    private final LoginMemberArgumentResolver loginMemberResolver;
    private final String[] allowedOrigins;
    private final boolean corsEnabled;

    public WebConfig(AuthInterceptor authInterceptor, LoginMemberArgumentResolver loginMemberResolver,
                     @Value("${app.cors.allowed-origins}") String[] allowedOrigins,
                     @Value("${app.cors.enabled:true}") boolean corsEnabled) {
        this.authInterceptor = authInterceptor;
        this.loginMemberResolver = loginMemberResolver;
        this.allowedOrigins = allowedOrigins;
        this.corsEnabled = corsEnabled;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (corsEnabled) {
            registry.addMapping("/**").allowedOrigins(allowedOrigins)
                    .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS").allowedHeaders("*");
        }
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor).addPathPatterns("/**").excludePathPatterns("/error");
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(loginMemberResolver);
    }
}
