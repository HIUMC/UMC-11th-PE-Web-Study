// src/main/java/com/umc/movie/controller/MemberController.java
package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.umc.movie.dto.MemberUpdateRequest;
import org.springframework.web.bind.annotation.PatchMapping;
import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.SignUpRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Tag(name = "회원", description = "회원가입과 내 정보 API")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(@PathVariable String nickname) {
        return memberService.checkNickname(nickname);
    }

    @Operation(
            summary = "회원가입",
            description = "이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다."
    )

    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);

        return ResponseEntity.status(201)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }

    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(@PathVariable String email) {
        return memberService.checkEmail(email);
    }

    @Operation(
            summary = "내 정보 조회",
            description = """
                로그인한 회원의 이메일, 닉네임, 가입 시각을 조회합니다.
                Bearer 토큰이 필요하며, 회원 ID는 토큰에서 가져옵니다.
                비밀번호는 응답에 포함하지 않습니다.
                """
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "COMMON200: 회원 정보 조회 성공"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = """
                        인증 실패:
                        AUTH401_2 — 토큰 없음 또는 Bearer 형식이 아님
                        AUTH401_3 — 유효하지 않은 토큰
                        AUTH401_4 — 만료된 토큰
                        """
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "MEMBER404_1: 토큰에 해당하는 회원을 찾을 수 없음"
            )
    })

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        MemberInfoResponse response = memberService.getMyInfo(memberId);

        return ResponseEntity.ok(
                ApiResponse.ok("회원 정보를 조회했습니다.", response)
        );
    }

    @Operation(
            summary = "내 정보 수정",
            description = """
                로그인한 회원의 닉네임을 수정합니다.
                Bearer 토큰이 필요하며, 회원 ID는 토큰에서 가져옵니다.
                닉네임은 2자 이상 12자 이하여야 합니다.
                자신의 현재 닉네임은 사용할 수 있지만,
                다른 회원이 사용 중인 닉네임으로는 변경할 수 없습니다.
                """
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "COMMON200: 수정된 회원 정보 반환"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "COMMON4001: 닉네임 필수 입력 또는 길이 검증 실패"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = """
                        인증 실패:
                        AUTH401_2 — 토큰 없음 또는 Bearer 형식이 아님
                        AUTH401_3 — 유효하지 않은 토큰
                        AUTH401_4 — 만료된 토큰
                        """
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "MEMBER404_1: 토큰에 해당하는 회원을 찾을 수 없음"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = """
                        MEMBER409_1: 다른 회원이 사용 중인 닉네임
                        COMMON4091: DB 제약 조건 위반
                        """
            )
    })

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid MemberUpdateRequest request
    ) {
        MemberInfoResponse response =
                memberService.updateMyInfo(memberId, request);

        return ResponseEntity.ok(
                ApiResponse.ok("회원 정보를 수정했습니다.", response)
        );
    }
}

