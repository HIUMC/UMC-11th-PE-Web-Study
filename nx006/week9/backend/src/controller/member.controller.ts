import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
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
import { MemberInfoDto, UpdateMemberDto } from '../dto/member-info.dto.js';
import { LoginMember } from '../decorator/login-member.decorator.js';
import { JwtAuthGuard } from '../guard/jwt-auth.guard.js';
import { NoQueryPipe } from '../pipe/no-query.pipe.js';

import { MemberResponseDto } from '../dto/member-response.dto.js';
import {
  ApiBusinessErrors,
  ApiEnvelopeSuccess,
  ApiMovieResult,
} from '../config/swagger.js';

const profileSchema = { $ref: getSchemaPath(MemberInfoDto) };
const profileExample = {
  email: 'learner@example.test',
  nickname: '영화탐험가',
  createdAt: '2026-11-26T00:00:00.000Z',
};

@ApiTags('회원')
@Controller('members')
export class MemberController {
  constructor(@Inject(MemberService) private readonly members: MemberService) {}

  @Get('me')
  @ApiOperation({
    summary: '내 정보 조회',
    description: 'Bearer 토큰으로 식별한 본인의 프로필을 조회합니다.',
  })
  @ApiEnvelopeSuccess(
    200,
    '회원 정보를 조회했습니다.',
    profileSchema,
    profileExample,
  )
  @ApiBusinessErrors(
    'authMissing',
    'authInvalid',
    'authExpired',
    'myMemberMissing',
  )
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async me(@LoginMember() memberId: string) {
    return success(
      'COMMON200',
      '회원 정보를 조회했습니다.',
      await this.members.myInfo(memberId),
    );
  }

  @Patch('me')
  @ApiOperation({
    summary: '내 닉네임 수정',
    description: 'Bearer 토큰으로 식별한 본인의 닉네임을 변경합니다.',
  })
  @ApiMovieResult(
    200,
    '회원 정보를 수정했습니다.',
    profileSchema,
    profileExample,
    'myMemberMissing',
    'myNicknameDuplicate',
  )
  @ApiBearerAuth()
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
  @ApiOperation({
    summary: '회원가입',
    description:
      '이메일, 비밀번호, 닉네임으로 계정을 등록합니다. 인증 없이 호출할 수 있습니다.',
  })
  @ApiEnvelopeSuccess(
    201,
    '회원가입에 성공했습니다.',
    { $ref: getSchemaPath(MemberResponseDto) },
    {
      memberId: 1,
      email: profileExample.email,
      nickname: profileExample.nickname,
    },
  )
  @ApiBusinessErrors('invalid', 'emailDuplicate', 'nicknameDuplicate')
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
