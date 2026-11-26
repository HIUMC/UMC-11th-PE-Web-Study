// src/main/java/com/umc/movie/controller/AuthController.java
package com.umc.movie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import static com.umc.movie.config.SwaggerConfig.BEARER_AUTH;

import com.umc.movie.dto.LoginRequest;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.LoginResponse;
import com.umc.movie.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "로그인 및 Access Token 발급", description = "공개 API입니다. 토큰이 필요하지 않습니다.",
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 닉네임과 Access Token 반환"),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001: 요청 필드 검증 실패",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"COMMON4001\", \"message\": \"요청 필드 검증 실패\", \"result\": null}"))),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_1: 이메일 또는 비밀번호 불일치",
                        content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = com.umc.movie.dto.ErrorResponse.class),
                                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(value = "{\"isSuccess\": false, \"code\": \"AUTH401_1\", \"message\": \"이메일 또는 비밀번호 불일치\", \"result\": null}")))
            })
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @RequestBody @Valid LoginRequest request
    ) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("로그인에 성공했습니다.", response));
    }
}
