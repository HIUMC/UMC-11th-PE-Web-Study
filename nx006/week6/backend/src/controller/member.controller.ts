import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { MemberService } from '../service/member.service.js';

import { NicknamePipe, EmailPipe } from '../pipe/member-input.pipe.js';
import { CreateMemberDto } from '../dto/create-member.dto.js';
import { success } from '../dto/api-response.dto.js';

@Controller('members')
export class MemberController {
  constructor(@Inject(MemberService) private readonly members: MemberService) {}

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
