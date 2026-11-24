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
            summary = "내정보 조회",
            description = "로그인 시 토큰을 발급받음과 동시에 받는 내정보입니다."
    )
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