import {
  Inject,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import type { Request } from 'express';
import { ApiException } from '../filter/errors.js';
export interface AuthenticatedRequest extends Request {
  memberId?: string;
}
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(JwtService) private readonly jwt: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;
    if (!header || !header.trim()) throw new ApiException('authMissing');
    const token = /^Bearer[ \t]+(\S+)$/i.exec(header)?.[1];
    if (!token) throw new ApiException('authInvalid');
    let payload: { sub?: unknown; exp?: unknown };
    try {
      payload = await this.jwt.verifyAsync(token, { algorithms: ['HS256'] });
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new ApiException('authExpired');
      throw new ApiException('authInvalid');
    }
    if (
      !payload ||
      typeof payload.sub !== 'string' ||
      !/^[1-9]\d*$/.test(payload.sub) ||
      !Number.isSafeInteger(Number(payload.sub)) ||
      typeof payload.exp !== 'number' ||
      !Number.isSafeInteger(payload.exp)
    )
      throw new ApiException('authInvalid');
    request.memberId = payload.sub;
    return true;
  }
}
