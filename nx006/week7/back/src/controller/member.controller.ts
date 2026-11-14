import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from '../service/member.service.js';

import { NicknamePipe, EmailPipe } from '../pipe/member-input.pipe.js';
import { CreateMemberDto } from '../dto/create-member.dto.js';
import { success } from '../dto/api-response.dto.js';
import { UpdateMemberDto } from '../dto/member-info.dto.js';
import { LoginMember } from '../decorator/login-member.decorator.js';
import { JwtAuthGuard } from '../guard/jwt-auth.guard.js';
import { NoQueryPipe } from '../pipe/no-query.pipe.js';

@Controller('members')
export class MemberController {
  constructor(@Inject(MemberService) private readonly members: MemberService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@LoginMember() memberId: string) {
    return success(
      'COMMON200',
      '회원 정보를 조회했습니다.',
      await this.members.myInfo(memberId),
    );
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(
    @LoginMember() memberId: string,
    @Body() dto: UpdateMemberDto,
    @Query(NoQueryPipe) _query: void,
  ) {
    return success(
      'COMMON200',
      '회원 정보를 수정했습니다.',
      await this.members.updateMyInfo(memberId, dto),
    );
  }

  @Post()
  @HttpCode(201)
  async signUp(@Body() dto: CreateMemberDto) {
    return success(
      'COMMON201',
      '회원가입에 성공했습니다.',
      await this.members.signUp(dto),
    );
  }

  @Get('nickname/:nickname')
  checkNickname(@Param('nickname', NicknamePipe) nickname: string) {
    return this.members.checkNickname(nickname);
  }

  @Get('email/:email')
  checkEmail(@Param('email', EmailPipe) email: string) {
    return this.members.checkEmail(email);
  }
}
