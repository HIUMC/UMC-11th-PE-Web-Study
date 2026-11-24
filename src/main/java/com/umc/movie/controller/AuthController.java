// src/main/java/com/umc/movie/controller/AuthController.java
package com.umc.movie.controller;

import com.umc.movie.dto.LoginRequest;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.LoginResponse;
import com.umc.movie.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(
            summary = "이메일 로그인",
            description = "토큰 없이 이메일과 비밀번호로 로그인합니다. 발급된 Access Token을 Authorize에 입력할 수 있습니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "로그인 성공 (COMMON200)", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "요청 값 검증 실패 (COMMON4001)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "이메일 또는 비밀번호가 일치하지 않음 (AUTH401_1)")
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @RequestBody @Valid LoginRequest request
    ) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("로그인에 성공했습니다.", response));
    }
}
