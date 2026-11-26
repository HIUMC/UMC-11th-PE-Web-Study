import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest } from '../guard/jwt-auth.guard.js';
import { ApiException } from '../filter/errors.js';
export const LoginMember = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const memberId = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>().memberId;
    if (!memberId) throw new ApiException('authMissing');
    return memberId;
  },
);
