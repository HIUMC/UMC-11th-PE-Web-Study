import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { type INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { MemberController } from '../src/controller/member.controller.js';
import { RatingController } from '../src/controller/rating.controller.js';
import { MemberService } from '../src/service/member.service.js';
import { RatingService } from '../src/service/rating.service.js';
import { Member } from '../src/entity/member.entity.js';
import { Rating } from '../src/entity/rating.entity.js';
import { CreateMemberDto } from '../src/dto/create-member.dto.js';
import {
  CreateRatingDto,
  UpdateRatingDto,
} from '../src/dto/create-rating.dto.js';
import { configureHttp } from '../src/config/http.js';

// Vitest/esbuild omits emitDecoratorMetadata. Restore only request parameter
// classes; production tsc emits this metadata, verified separately with real DB.
Reflect.defineMetadata(
  'design:paramtypes',
  [CreateMemberDto],
  MemberController.prototype,
  'signUp',
);
Reflect.defineMetadata(
  'design:paramtypes',
  [String, CreateRatingDto],
  RatingController.prototype,
  'create',
);
Reflect.defineMetadata(
  'design:paramtypes',
  [String, String, UpdateRatingDto],
  RatingController.prototype,
  'update',
);

describe('6주차 HTTP (mock repositories, real validation/bcrypt)', () => {
  let app: INestApplication;
  let saved: Member;
  const memberExists = vi.fn(
    async (where: Record<string, string>) =>
      where.email === 'duplicate@example.com' ||
      where.nickname === '중복닉네임' ||
      where.memberId === '1',
  );
  const rating = {
    ratingId: '2',
    memberId: '1',
    movieId: '155',
    score: 4,
    comment: null,
  };
  const ratingExists = vi.fn(
    async (where: { movieId: string }) => where.movieId === '550',
  );
  const ratingSave = vi.fn(async (row: Rating) =>
    Object.assign(new Rating(), row, { ratingId: row.ratingId ?? '3' }),
  );
  const remove = vi.fn(async () => undefined);
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [MemberController, RatingController],
      providers: [
        MemberService,
        RatingService,
        {
          provide: getRepositoryToken(Member),
          useValue: {
            existsBy: memberExists,
            create: (row: Member) => row,
            save: async (row: Member) => {
              saved = Object.assign(new Member(), row, { memberId: '10' });
              return saved;
            },
          },
        },
        {
          provide: getRepositoryToken(Rating),
          useValue: {
            existsBy: ratingExists,
            create: (row: Rating) => row,
            save: ratingSave,
            remove,
            findOneBy: async ({ ratingId }: { ratingId: string }) =>
              ratingId === '2' ? { ...rating } : null,
            find: async () => [],
          },
        },
      ],
    }).compile();
    app = module.createNestApplication();
    configureHttp(app);
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  const valid = () => ({
    email: 'new@example.com',
    nickname: '새회원',
    password: 'Test!1234',
  });

  it('201 공개 DTO와 bcrypt 비용 10 저장', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/members')
      .send(valid())
      .expect(201);
    expect(body).toEqual({
      isSuccess: true,
      code: 'COMMON201',
      message: '회원가입에 성공했습니다.',
      result: { memberId: 10, email: 'new@example.com', nickname: '새회원' },
    });
    expect(saved.password).not.toBe(valid().password);
    expect(bcrypt.getRounds(saved.password)).toBe(10);
    expect(await bcrypt.compare(valid().password, saved.password)).toBe(true);
  });
  it.each([
    { email: '' },
    { email: 'bad' },
    { email: null },
    { email: 'a'.repeat(250) + '@e.com' },
    { nickname: '가' },
    { nickname: '가'.repeat(13) },
    { nickname: null },
    { nickname: [] },
    { password: 'short' },
    { password: 'abcd!1234' },
    { password: 'ABCD!1234' },
    { password: 'Abcdefgh!' },
    { password: 'Abcdefg1?' },
    { password: 'Aa1!' + '가'.repeat(23) },
    { password: null },
    { role: 'admin' },
  ])('회원 DTO 거부 %# (조회 전)', async (invalid) => {
    const before = memberExists.mock.calls.length;
    const { body } = await request(app.getHttpServer())
      .post('/members')
      .send({ ...valid(), ...invalid })
      .expect(400);
    expect(body).toMatchObject({
      isSuccess: false,
      code: 'COMMON400',
      result: null,
    });
    expect(typeof body.message).toBe('string');
    expect(memberExists.mock.calls.length).toBe(before);
    expect(JSON.stringify(body)).not.toContain(valid().password);
  });
  it.each(['가나', '가'.repeat(12), '😀😀', 'a\uFE0F'])(
    '닉네임 code point 정책 %s',
    async (nickname) => {
      await request(app.getHttpServer())
        .post('/members')
        .send({ ...valid(), nickname })
        .expect(201);
    },
  );
  it.each(['😀', '😀'.repeat(13)])(
    '닉네임 emoji 경계 거부 %s',
    async (nickname) => {
      await request(app.getHttpServer())
        .post('/members')
        .send({ ...valid(), nickname })
        .expect(400);
    },
  );
  it('72 byte 경계와 trim 없는 비밀번호', async () => {
    const password = 'Aa1!' + 'x'.repeat(67) + ' ';
    await request(app.getHttpServer())
      .post('/members')
      .send({ ...valid(), password })
      .expect(201);
    expect(await bcrypt.compare(password, saved.password)).toBe(true);
    expect(await bcrypt.compare(password.trim(), saved.password)).toBe(false);
    await request(app.getHttpServer())
      .post('/members')
      .send({ ...valid(), password: password + 'x' })
      .expect(400);
  });
  it.each([
    [{ email: 'duplicate@example.com' }, 'MEMBER4091'],
    [{ nickname: '중복닉네임' }, 'MEMBER4092'],
  ])('이메일/닉네임 중복 구분 %#', async (fields, code) => {
    const { body } = await request(app.getHttpServer())
      .post('/members')
      .send({ ...valid(), ...fields })
      .expect(409);
    expect(body.code).toBe(code);
  });
  it('평점 등록·생략 comment null', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/members/1/ratings')
      .send({ movieId: 155, score: 3 })
      .expect(201);
    expect(body.result).toBe(3);
    expect(ratingSave).toHaveBeenLastCalledWith(
      expect.objectContaining({
        memberId: '1',
        member: { memberId: '1' },
        movieId: '155',
        comment: null,
      }),
    );
  });
  it.each([0, 6, 1.5, '4', null, [], {}])('score 거부 %#', async (score) => {
    await request(app.getHttpServer())
      .post('/members/1/ratings')
      .send({ movieId: 155, score })
      .expect(400);
  });
  it.each([0, -1, 1.5, '155', null, [], {}, 9007199254740992])(
    'movieId 거부 %#',
    async (movieId) => {
      await request(app.getHttpServer())
        .post('/members/1/ratings')
        .send({ movieId, score: 4 })
        .expect(400);
    },
  );
  it.each([null, [], {}, '가'.repeat(501)])(
    'comment 거부 %#',
    async (comment) => {
      await request(app.getHttpServer())
        .post('/members/1/ratings')
        .send({ movieId: 155, score: 4, comment })
        .expect(400);
    },
  );
  it('등록 404와 409', async () => {
    const missing = await request(app.getHttpServer())
      .post('/members/999/ratings')
      .send({ movieId: 155, score: 4 })
      .expect(404);
    expect(missing.body.code).toBe('MEMBER4041');
    const duplicate = await request(app.getHttpServer())
      .post('/members/1/ratings')
      .send({ movieId: 550, score: 4 })
      .expect(409);
    expect(duplicate.body.code).toBe('RATING4091');
  });
  it('PATCH score 필수·comment 생략 null/빈 문자열 보존', async () => {
    await request(app.getHttpServer())
      .patch('/members/1/ratings/2')
      .send({ comment: 'only' })
      .expect(400);
    const { body } = await request(app.getHttpServer())
      .patch('/members/1/ratings/2')
      .send({ score: 5 })
      .expect(200);
    expect(body).toEqual({
      isSuccess: true,
      code: 'COMMON200',
      message: '평점 수정에 성공했습니다.',
      result: null,
    });
    expect(ratingSave).toHaveBeenLastCalledWith(
      expect.objectContaining({ score: 5, comment: null }),
    );
    await request(app.getHttpServer())
      .patch('/members/1/ratings/2')
      .send({ score: 5, comment: '' })
      .expect(200);
    expect(ratingSave).toHaveBeenLastCalledWith(
      expect.objectContaining({ comment: '' }),
    );
    await request(app.getHttpServer())
      .patch('/members/1/ratings/2')
      .send({ score: 5, movieId: 1 })
      .expect(400);
  });
  it.each(['patch', 'delete'] as const)(
    '%s: 타인 403, 부재 404, 변경 없음',
    async (method) => {
      const before = ratingSave.mock.calls.length,
        removed = remove.mock.calls.length;
      const forbidden = await request(app.getHttpServer())
        [method]('/members/2/ratings/2')
        .send({ score: 5 })
        .expect(403);
      expect(forbidden.body.code).toBe('RATING4031');
      await request(app.getHttpServer())
        [method]('/members/1/ratings/999')
        .send({ score: 5 })
        .expect(404);
      expect(ratingSave.mock.calls.length).toBe(before);
      expect(remove.mock.calls.length).toBe(removed);
    },
  );
  it('DELETE 204 body 없음', async () => {
    const response = await request(app.getHttpServer())
      .delete('/members/1/ratings/2')
      .expect(204);
    expect(response.text).toBe('');
    expect(response.headers['content-type']).toBeUndefined();
  });
  it.each(['0', '-1', '1.5', 'abc', '9007199254740992'])(
    'ratingId 경계 %s',
    async (id) => {
      await request(app.getHttpServer())
        .delete('/members/1/ratings/' + id)
        .expect(400);
    },
  );
  it('GET 성공 그대로, GET 오류 공통화', async () => {
    await request(app.getHttpServer())
      .get('/members/nickname/미사용')
      .expect(200, { available: true });
    await request(app.getHttpServer())
      .get('/members/1/ratings')
      .expect(200, []);
    const response = await request(app.getHttpServer())
      .get('/members/999/ratings')
      .expect(404);
    expect(response.body).toEqual({
      isSuccess: false,
      code: 'MEMBER4041',
      message: '존재하지 않는 유저입니다.',
      result: null,
    });
  });
  it('예상하지 못한 오류의 내부 정보 비공개', async () => {
    memberExists.mockRejectedValueOnce(new Error('private SQL credential'));
    const { body } = await request(app.getHttpServer())
      .post('/members')
      .send(valid())
      .expect(500);
    expect(body.code).toBe('COMMON500');
    expect(JSON.stringify(body)).not.toContain('private');
  });
  it('깨진 JSON의 입력값 비공개', async () => {
    const response = await request(app.getHttpServer())
      .post('/members')
      .set('Content-Type', 'application/json')
      .send('{"password":"private-input", invalid}')
      .expect(400);
    expect(response.body.code).toBe('COMMON400');
    expect(JSON.stringify(response.body)).not.toContain('private-input');
  });
  it.each([[], [1], null, 'scalar'])(
    '객체가 아닌 root body 거부 %#',
    async (body) => {
      await request(app.getHttpServer())
        .post('/members')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(body))
        .expect(400);
    },
  );
});
