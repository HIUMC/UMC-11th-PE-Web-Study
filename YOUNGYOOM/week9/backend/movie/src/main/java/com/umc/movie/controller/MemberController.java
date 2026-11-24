// src/main/java/com/umc/movie/controller/MemberController.java
package com.umc.movie.controller;

import com.umc.movie.annotation.LoginMember;
import com.umc.movie.dto.*;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.umc.movie.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Tag(name = "회원", description = "회원가입과 내 정보 API")
public class MemberController {

    private final MemberService memberService;

    @Operation(
            summary = "닉네임 중복 여부 확인",
            description = "닉네임 중복 여부를 확인합니다. 닉네임은 2-12자 입니다."
    )
    //GET -> 닉네임 중복 여부 확인
    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(@PathVariable String nickname) {
        return memberService.checkNickname(nickname);
    }

    @Operation(
            summary = "이메일 중복 여부 확인",
            description = "이메일 중복 여부를 확인합니다. 이메일 형식을 지켜야합니다."
    )
    //GET -> 이메일 중복 여부 확인
    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(@PathVariable String email) {
        return memberService.checkEmail(email);
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
        return ResponseEntity.status(201).body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }


    @Operation(
            summary = "내 정보 조회",
            description = "로그인한 회원의 정보를 조회합니다. Bearer 토큰이 필요합니다.",
            security = @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "내 정보 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "인증 헤더 누락 또는 형식 오류 (AUTH401_2), "
                            + "유효하지 않은 토큰 (AUTH401_3), 만료된 토큰 (AUTH401_4)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "회원을 찾을 수 없음 (MEMBER404_1)")
    })
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            //인터셉터는 JWT 검증 성공시 회원 ID를 현재 요청에 저장
            @LoginMember Long memberId) {
        //JWT에서 확인한 회원 ID를 서비스에 전달해 내정보 조회
        MemberInfoResponse response = memberService.getMyInfo(memberId);

        //조회 결과를 프로젝트의 공통 응답 형식에 담아 HTTP 200 OK로 반환
        return ResponseEntity.ok(ApiResponse.ok("회원정보를 조회했습니다.", response));
    }

    //닉네임 수정
    @Operation(
            summary = "내 정보 수정",
            description = "로그인한 회원의 닉네임을 수정합니다. Bearer 토큰이 필요합니다.",
            security = @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "내 정보 수정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "요청값 검증 실패 (COMMON4001)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "인증 헤더 누락 또는 형식 오류 (AUTH401_2), "
                            + "유효하지 않은 토큰 (AUTH401_3), 만료된 토큰 (AUTH401_4)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "회원을 찾을 수 없음 (MEMBER404_1)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "이미 사용 중인 닉네임 (MEMBER409_1)")
    })
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            //인터셉터는 JWT 검증 성공시 회원 ID를 현재 요청에 저장
            @LoginMember Long memberId,
            //@RequestBody가 JSON을 MemberUpdateRequest로 변환
            //@Valid가 DTO에 선언한 @NOTBlank와 @Size 조건 검사
            @RequestBody @Valid MemberUpdateRequest request
    ) {
        //JWT에서 확인한 회원 ID를 서비스에 전달해 내정보 조회
        MemberInfoResponse response = memberService.updateMyInfo(memberId, request);

        //조회 결과를 프로젝트의 공통 응답 형식에 담아 HTTP 200 OK로 반환
        return ResponseEntity.ok(ApiResponse.ok("회원정보를 수정했습니다.", response));
    }
}