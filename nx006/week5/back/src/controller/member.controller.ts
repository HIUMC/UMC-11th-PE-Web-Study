import { Controller, Get, Inject, Param } from '@nestjs/common';
import { MemberService } from '../service/member.service.js';

import { NicknamePipe, EmailPipe } from '../pipe/member-input.pipe.js';

@Controller('members')
export class MemberController {
  constructor(@Inject(MemberService) private readonly members: MemberService) {}

  @Get('nickname/:nickname')
  checkNickname(@Param('nickname', NicknamePipe) nickname: string) {
    return this.members.checkNickname(nickname);
  }

  @Get('email/:email')
  checkEmail(@Param('email', EmailPipe) email: string) {
    return this.members.checkEmail(email);
  }
}
