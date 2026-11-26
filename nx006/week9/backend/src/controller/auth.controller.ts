import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service.js';
import { LoginDto } from '../dto/login.dto.js';
import { success } from '../dto/api-response.dto.js';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBusinessErrors, ApiEnvelopeSuccess } from '../config/swagger.js';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}
  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: '로그인',
    description:
      '이메일과 비밀번호를 확인하고 Bearer 토큰을 발급합니다. 인증 없이 호출할 수 있습니다.',
  })
  @ApiEnvelopeSuccess(
    200,
    '로그인에 성공했습니다.',
    {
      type: 'object',
      required: ['nickname', 'accessToken'],
      properties: {
        nickname: { type: 'string' },
        accessToken: { type: 'string' },
      },
    },
    { nickname: '영화탐험가', accessToken: '<access-token>' },
  )
  @ApiBusinessErrors('invalid', 'authCredentials')
  async login(@Body() dto: LoginDto) {
    return success(
      'COMMON200',
      '로그인에 성공했습니다.',
      await this.auth.login(dto),
    );
  }
}
