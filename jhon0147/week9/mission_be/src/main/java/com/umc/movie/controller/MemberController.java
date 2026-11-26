package com.umc.movie.controller;
import com.umc.movie.config.ApiExamples;
import com.umc.movie.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.umc.movie.auth.LoginMember;
import com.umc.movie.dto.*;
import com.umc.movie.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "회원", description = "회원가입·중복 확인·내 정보")
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @Operation(summary = "닉네임 중복 확인", description = "공개 API. 사용 가능하면 available은 true입니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 조회 성공")
    })
    @GetMapping("/nickname/{nickname}")
    public ApiResponse<NicknameCheckResponse> checkNickname(@PathVariable String nickname) {
        return ApiResponse.ok("닉네임 중복 확인에 성공했습니다.", memberService.checkNickname(nickname));
    }

    @Operation(summary = "이메일 중복 확인", description = "공개 API. 사용 가능하면 available은 true입니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 조회 성공")
    })
    @GetMapping("/email/{email}")
    public ApiResponse<EmailCheckResponse> checkEmail(@PathVariable String email) {
        return ApiResponse.ok("이메일 중복 확인에 성공했습니다.", memberService.checkEmail(email));
    }

    @Operation(summary = "회원가입", description = "공개 API. 이메일·비밀번호·닉네임 입력 규칙은 요청 스키마를 확인하세요.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 회원가입 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 입력 형식 또는 검증 오류",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "입력 오류", value = ApiExamples.BAD_REQUEST)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "MEMBER409_1 닉네임 중복 / MEMBER409_2 이메일 중복",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "닉네임 중복", value = ApiExamples.NICKNAME_CONFLICT),
                                @ExampleObject(name = "이메일 중복", value = ApiExamples.EMAIL_CONFLICT)
                        }))
    })
    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(@Valid @RequestBody SignUpRequest request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.created("회원가입에 성공했습니다.", memberService.signUp(request)));
    }

    @Operation(summary = "내 정보 조회", description = "인증 필요. 토큰에서 식별한 회원의 정보를 조회합니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 조회 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "토큰 누락", value = ApiExamples.UNAUTHORIZED),
                                @ExampleObject(name = "잘못된 토큰", value = ApiExamples.INVALID_TOKEN),
                                @ExampleObject(name = "만료", value = ApiExamples.EXPIRED_TOKEN)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "회원 없음", value = ApiExamples.MEMBER_NOT_FOUND)
                        }))
    })
    @GetMapping("/me")
    public ApiResponse<MemberInfoResponse> getMyInfo(@Parameter(hidden = true) @LoginMember Long memberId) {
        return ApiResponse.ok("회원 정보를 조회했습니다.", memberService.getMyInfo(memberId));
    }

    @Operation(summary = "내 정보 수정", description = "인증 필요. 본인의 닉네임을 2~12자로 수정합니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 수정 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 입력 형식 또는 검증 오류",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "입력 오류", value = ApiExamples.BAD_REQUEST)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "토큰 누락", value = ApiExamples.UNAUTHORIZED),
                                @ExampleObject(name = "잘못된 토큰", value = ApiExamples.INVALID_TOKEN),
                                @ExampleObject(name = "만료", value = ApiExamples.EXPIRED_TOKEN)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "회원 없음", value = ApiExamples.MEMBER_NOT_FOUND)
                        })),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "MEMBER409_1 다른 회원의 닉네임과 중복",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class),
                        examples = {
                                @ExampleObject(name = "닉네임 중복", value = ApiExamples.NICKNAME_CONFLICT)
                        }))
    })
    @PatchMapping("/me")
    public ApiResponse<MemberInfoResponse> updateMyInfo(@Parameter(hidden = true) @LoginMember Long memberId,
                                                       @Valid @RequestBody MemberUpdateRequest request) {
        return ApiResponse.ok("회원 정보를 수정했습니다.", memberService.updateMyInfo(memberId, request));
    }
}
