import { MemberService } from './member.service.js';
import { RatingService } from './rating.service.js';
import { RatingResponseDto, safeId } from '../dto/rating-response.dto.js';
import { MemberIdPipe } from '../pipe/member-id.pipe.js';
import { validateEnvironment } from '../config/environment.js';
import type { Repository } from 'typeorm';
import type { Member } from '../entity/member.entity.js';
import type { Rating } from '../entity/rating.entity.js';

const memberRepo = (existsBy = vi.fn()) =>
  ({ existsBy }) as unknown as Repository<Member>;

describe('필수 Service / DTO 계약', () => {
  it('중복 여부를 반전하고 문자열을 변경하지 않는다', async () => {
    const existsBy = vi
      .fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    const service = new MemberService(memberRepo(existsBy));
    expect(await service.checkNickname(' 수현 ')).toEqual({ available: false });
    expect(await service.checkEmail('UPPER@example.com')).toEqual({
      available: true,
    });
    expect(existsBy.mock.calls).toEqual([
      [{ nickname: ' 수현 ' }],
      [{ email: 'UPPER@example.com' }],
    ]);
  });
  it('미존재 회원은 평점 조회 전에 404', async () => {
    const find = vi.fn();
    const service = new RatingService(
      memberRepo(vi.fn().mockResolvedValue(false)),
      { find } as unknown as Repository<Rating>,
    );
    await expect(service.findByMember('999')).rejects.toThrow(
      '존재하지 않는 유저입니다.',
    );
    expect(find).not.toHaveBeenCalled();
  });
  it('회원은 존재하고 평점이 없으면 빈 배열 / ID 내림차순 조회', async () => {
    const find = vi.fn().mockResolvedValue([]);
    const service = new RatingService(
      memberRepo(vi.fn().mockResolvedValue(true)),
      { find } as unknown as Repository<Rating>,
    );
    expect(await service.findByMember('3')).toEqual([]);
    expect(find).toHaveBeenCalledWith({
      where: { memberId: '3' },
      order: { ratingId: 'DESC' },
    });
  });
  it('DTO는 숫자 ID와 공개 여섯 필드만 반환', () => {
    const date = new Date('2026-10-10T00:00:00Z');
    const dto = RatingResponseDto.from({
      ratingId: '2',
      movieId: '155',
      memberId: '1',
      member: { password: 'hidden' },
      score: 4,
      comment: null,
      createdAt: date,
      updatedAt: date,
    } as Rating);
    expect(JSON.parse(JSON.stringify(dto))).toEqual({
      ratingId: 2,
      movieId: 155,
      score: 4,
      comment: null,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  });
  it.each(['0', '-1', '1.5', '9007199254740992', '1e3', ''])(
    'DTO rejects unsafe ID %s',
    (value) => {
      expect(() => safeId(value)).toThrow();
    },
  );
  it('safe integer 상한 허용', () =>
    expect(safeId('9007199254740991')).toBe(Number.MAX_SAFE_INTEGER));
  it.each(['0', '-1', '1.5', '9007199254740992', '1e3', ' ', 'abc'])(
    'memberId rejects %s',
    (value) => {
      expect(() => new MemberIdPipe().transform(value)).toThrow();
    },
  );
});

describe('환경 설정', () => {
  const env = {
    DB_HOST: 'localhost',
    DB_PORT: '3307',
    DB_USER: 'user',
    DB_PASSWORD: 'dummy',
    DB_NAME: 'test',
  };
  it('지정 DB 포트를 보존', () =>
    expect(validateEnvironment(env).DB_PORT).toBe(3307));
  it('누락된 변수 이름만 안내', () =>
    expect(() => validateEnvironment({ ...env, DB_PASSWORD: '' })).toThrow(
      'DB_PASSWORD',
    ));
  it('잘못된 포트 차단', () =>
    expect(() => validateEnvironment({ ...env, DB_PORT: 'x' })).toThrow(
      'DB_PORT',
    ));
  it('production 실습 설정 차단', () =>
    expect(() =>
      validateEnvironment({ ...env, NODE_ENV: 'production', CORS_MODE: 'all' }),
    ).toThrow());
});
