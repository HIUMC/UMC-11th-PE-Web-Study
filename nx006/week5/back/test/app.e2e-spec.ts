import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { MemberController } from '../src/controller/member.controller.js';
import { RatingController } from '../src/controller/rating.controller.js';
import { MemberService } from '../src/service/member.service.js';
import { RatingService } from '../src/service/rating.service.js';
import { Member } from '../src/entity/member.entity.js';
import { Rating } from '../src/entity/rating.entity.js';

// HTTP plumbing with mocked repositories; real MySQL coverage is scripts/integration.mjs.
describe('필수 HTTP 계약 (mock repository)', () => {
  let app: INestApplication;
  const existsBy = vi.fn(
    async (where: Record<string, string>) =>
      where.nickname === '수현' ||
      where.email === 'noco@umc.com' ||
      ['1', '3'].includes(where.memberId),
  );
  const find = vi.fn(async ({ where }: { where: { memberId: string } }) =>
    where.memberId === '3'
      ? []
      : [
          {
            ratingId: '2',
            movieId: '155',
            score: 4,
            comment: null,
            createdAt: new Date('2026-10-10T00:00:00Z'),
            updatedAt: new Date('2026-10-10T00:00:00Z'),
          },
        ],
  );
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [MemberController, RatingController],
      providers: [
        MemberService,
        RatingService,
        { provide: getRepositoryToken(Member), useValue: { existsBy } },
        { provide: getRepositoryToken(Rating), useValue: { find } },
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  it.each([
    ['nickname', '수현', false],
    ['nickname', '미사용닉네임', true],
    ['email', 'noco@umc.com', false],
    ['email', 'unused@example.com', true],
  ])('%s/%s', async (kind, value, available) => {
    await request(app.getHttpServer())
      .get(`/members/${kind}/${encodeURIComponent(String(value))}`)
      .expect(200, { available });
  });
  it('평점 숫자 타입과 공개 필드', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/members/1/ratings')
      .expect(200);
    expect(Object.keys(body[0]).sort()).toEqual(
      [
        'ratingId',
        'movieId',
        'score',
        'comment',
        'createdAt',
        'updatedAt',
      ].sort(),
    );
    expect(body[0].ratingId).toBe(2);
  });
  it.each([
    ['nickname', '가'],
    ['nickname', '가'.repeat(13)],
    ['email', 'bad'],
    ['email', 'a b@example.com'],
  ])('선택 입력 실패는 조회 전 400: %s/%s', async (kind, value) => {
    const before = existsBy.mock.calls.length;
    await request(app.getHttpServer())
      .get(`/members/${kind}/${encodeURIComponent(value)}`)
      .expect(400);
    expect(existsBy.mock.calls.length).toBe(before);
  });
  it('선택 페이지네이션을 repository skip/take로 전달', async () => {
    await request(app.getHttpServer())
      .get('/members/1/ratings?page=1&size=1')
      .expect(200);
    expect(find).toHaveBeenLastCalledWith({
      where: { memberId: '1' },
      order: { ratingId: 'DESC' },
      skip: 1,
      take: 1,
    });
  });
  it.each(['page=-1', 'size=0', 'page=0&page=1', 'size[x]=1'])(
    '선택 query 실패는 조회 전 400 %s',
    async (query) => {
      const before = existsBy.mock.calls.length;
      await request(app.getHttpServer())
        .get('/members/1/ratings?' + query)
        .expect(400);
      expect(existsBy.mock.calls.length).toBe(before);
    },
  );
  it('평점 없음', async () => {
    await request(app.getHttpServer())
      .get('/members/3/ratings')
      .expect(200, []);
  });
  it('회원 없음', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/members/999/ratings')
      .expect(404);
    expect(body.message).toBe('존재하지 않는 유저입니다.');
  });
  it.each(['0', '-1', '1.5', 'abc', '9007199254740992'])(
    '잘못된 ID %s',
    async (id) => {
      const before = existsBy.mock.calls.length;
      await request(app.getHttpServer())
        .get(`/members/${id}/ratings`)
        .expect(400);
      expect(existsBy.mock.calls.length).toBe(before);
    },
  );
});
