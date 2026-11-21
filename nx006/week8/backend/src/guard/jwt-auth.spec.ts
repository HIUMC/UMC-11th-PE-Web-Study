import { randomBytes } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import type { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard.js';

describe('JWT 인증 경계 (local test JWT)', () => {
  const secret = randomBytes(32).toString('hex');
  const jwt = new JwtService({ secret, signOptions: { expiresIn: 3600 } });
  const guard = new JwtAuthGuard(jwt);
  const context = (authorization?: string) => {
    const request = {
      headers: { authorization },
      memberId: undefined as string | undefined,
    };
    return {
      request,
      host: {
        switchToHttp: () => ({ getRequest: () => request }),
      } as ExecutionContext,
    };
  };
  it('헤더 누락과 정상 문자열 sub', async () => {
    await expect(guard.canActivate(context().host)).rejects.toMatchObject({
      response: { code: 'AUTH401_2' },
    });
    const ctx = context('Bearer ' + jwt.sign({ sub: '12' }));
    expect(await guard.canActivate(ctx.host)).toBe(true);
    expect(ctx.request.memberId).toBe('12');
  });
  it.each(['Basic abc', 'Bearer', 'Bearer a b', 'Bearer broken'])(
    '헤더 문법/서명 실패 %#',
    async (header) => {
      await expect(
        guard.canActivate(context(header).host),
      ).rejects.toMatchObject({ response: { code: 'AUTH401_3' } });
    },
  );
  it.each([0, 1, '0', '-1', '1.5', '1e3', '9007199254740992', '01', null])(
    'invalid sub %#',
    async (sub) => {
      await expect(
        guard.canActivate(context('Bearer ' + jwt.sign({ sub })).host),
      ).rejects.toMatchObject({ response: { code: 'AUTH401_3' } });
    },
  );
  it('만료, 다른 서명 키, 다른 알고리즘, exp 누락', async () => {
    await expect(
      guard.canActivate(
        context('Bearer ' + jwt.sign({ sub: '1' }, { expiresIn: -1 })).host,
      ),
    ).rejects.toMatchObject({ response: { code: 'AUTH401_4' } });
    const foreign = new JwtService({
      secret: randomBytes(32).toString('hex'),
      signOptions: { expiresIn: 60 },
    });
    for (const token of [
      foreign.sign({ sub: '1' }),
      jwt.sign({ sub: '1' }, { algorithm: 'HS512' }),
      new JwtService({ secret }).sign({ sub: '1' }),
    ]) {
      await expect(
        guard.canActivate(context('Bearer ' + token).host),
      ).rejects.toMatchObject({ response: { code: 'AUTH401_3' } });
    }
  });
});
