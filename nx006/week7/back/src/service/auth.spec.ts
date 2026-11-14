import bcrypt from 'bcrypt';
import type { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import type { Member } from '../entity/member.entity.js';
import { validateEnvironment } from '../config/environment.js';
import { randomBytes } from 'node:crypto';

describe('로그인 service + JWT 환경', () => {
  it('복잡도 규칙을 다시 적용하지 않고 저장 해시 비교; 명시적 공개 결과', async () => {
    const password = 'weak';
    const member = {
      memberId: '1',
      nickname: '테스트',
      password: await bcrypt.hash(password, 10),
    };
    const getOne = vi.fn().mockResolvedValue(member);
    const builder = {
      addSelect: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      getOne,
    };
    const repo = {
      createQueryBuilder: () => builder,
    } as unknown as Repository<Member>;
    const signAsync = vi.fn().mockResolvedValue('[mock token, not a JWT]');
    const service = new AuthService(repo, {
      signAsync,
    } as unknown as JwtService);
    expect(
      Object.keys(
        await service.login({ email: 'x@example.com', password }),
      ).sort(),
    ).toEqual(['accessToken', 'nickname']);
    expect(builder.addSelect).toHaveBeenCalledWith('member.password');
    expect(signAsync).toHaveBeenCalledWith({ sub: '1' });
    await expect(
      service.login({ email: 'x@example.com', password: 'wrong' }),
    ).rejects.toMatchObject({ response: { code: 'AUTH401_1' } });
    getOne.mockResolvedValueOnce(null);
    await expect(
      service.login({ email: 'none@example.com', password: 'wrong' }),
    ).rejects.toMatchObject({ response: { code: 'AUTH401_1' } });
  });
  const base = {
    DB_HOST: 'localhost',
    DB_PORT: '3306',
    DB_USER: 'root',
    DB_PASSWORD: '',
    DB_NAME: 'test',
    JWT_SECRET: randomBytes(32).toString('hex'),
    JWT_ACCESS_EXPIRATION: '3600',
  };
  it.each(['0', '-1', '1.5', '60s', '', undefined, '9007199254740992'])(
    'invalid TTL %#',
    (value) => {
      expect(() =>
        validateEnvironment({ ...base, JWT_ACCESS_EXPIRATION: value }),
      ).toThrow('JWT_ACCESS_EXPIRATION');
    },
  );
  it('expiration seconds number and missing/short key', () => {
    expect(
      validateEnvironment({ ...base, JWT_ACCESS_EXPIRATION: '60' })
        .JWT_ACCESS_EXPIRATION,
    ).toBe(60);
    expect(() => validateEnvironment({ ...base, JWT_SECRET: '' })).toThrow(
      'JWT_SECRET',
    );
  });
});
