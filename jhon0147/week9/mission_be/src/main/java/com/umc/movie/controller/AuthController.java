package com.umc.movie.controller;
import com.umc.movie.config.ApiExamples;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.LoginRequest;
import com.umc.movie.dto.LoginResponse;
import com.umc.movie.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "로그인", description = "공개 API: accessToken 발급")
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @Operation(summary = "로그인", description = "공개 API. 이메일과 비밀번호로 로그인하고 JWT를 발급합니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 로그인 성공. result.accessToken을 Authorize에 입력"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 입력 형식 또는 검증 오류",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "입력 오류", value = ApiExamples.BAD_REQUEST)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_1 이메일 또는 비밀번호 불일치",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "로그인 실패", value = ApiExamples.LOGIN_FAILED)
                        }))
    })
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok("로그인에 성공했습니다.", authService.login(request));
    }
}
