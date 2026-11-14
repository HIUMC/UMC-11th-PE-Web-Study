import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service.js';
import { LoginDto } from '../dto/login.dto.js';
import { success } from '../dto/api-response.dto.js';
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return success(
      'COMMON200',
      '로그인에 성공했습니다.',
      await this.auth.login(dto),
    );
  }
}
