package com.umc.umcine.controller;

import com.umc.umcine.dto.ApiResponse;
import com.umc.umcine.dto.LoginRequest;
import com.umc.umcine.dto.LoginResponse;
import com.umc.umcine.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "인증", description = "로그인과 토큰 발급 API")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "이메일 로그인", description = "토큰 없이 호출하는 공개 API입니다. 이메일과 비밀번호로 로그인하여 result.accessToken을 발급받습니다. 토큰은 Authorize에 입력합니다.")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.ok("로그인에 성공했습니다.", response)
        );
    }
}