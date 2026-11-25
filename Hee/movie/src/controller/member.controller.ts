
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";

import { AuthGuard } from "../guard/auth.guard.js";
import { CreateMemberDto } from "../dto/create-member.dto.js";
import { MemberUpdateRequestDto } from "../dto/member-update-request.dto.js";
import { MemberService } from "../service/member.service.js";

type AuthenticatedRequest = Request & {
  memberId: number;
};

@ApiTags("회원")
@Controller("members")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get("nickname/:nickname")
  checkNickname(@Param("nickname") nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  @Get("email/:email")
  checkEmail(@Param("email") email: string) {
    return this.memberService.checkEmail(email);
  }

  @ApiOperation({
    summary: "회원가입",
    description:
      "이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.",
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CreateMemberDto) {
    const result = await this.memberService.signUp(dto);

    return {
      isSuccess: true,
      code: "COMMON201",
      message: "회원가입에 성공했습니다.",
      result,
    };
  }

  // 내 정보 조회
  @ApiOperation({ summary: "내 정보 조회" })
  @ApiBearerAuth("bearerAuth")
  @Get("me")
  @UseGuards(AuthGuard)
  async getMyInfo(@Req() request: AuthenticatedRequest) {
    const result = await this.memberService.getMyInfo(request.memberId);

    return {
      isSuccess: true,
      code: "COMMON200",
      message: "회원 정보를 조회했습니다.",
      result,
    };
  }

  // 내 정보 수정
  @ApiOperation({ summary: "내 정보 수정" })
  @ApiBearerAuth("bearerAuth")
  @Patch("me")
  @UseGuards(AuthGuard)
  async updateMyInfo(
    @Req() request: AuthenticatedRequest,
    @Body() dto: MemberUpdateRequestDto,
  ) {
    const result = await this.memberService.updateMyInfo(
      request.memberId,
      dto,
    );

    return {
      isSuccess: true,
      code: "COMMON200",
      message: "회원 정보를 수정했습니다.",
      result,
    };
  }
  
}
