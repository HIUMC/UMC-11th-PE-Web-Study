import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { MemberController } from '../src/controller/member.controller.js';
import { AuthController } from '../src/controller/auth.controller.js';
import { MemberService } from '../src/service/member.service.js';
import { AuthService } from '../src/service/auth.service.js';
import { Member } from '../src/entity/member.entity.js';
import { LoginDto } from '../src/dto/login.dto.js';
import { UpdateMemberDto } from '../src/dto/member-info.dto.js';
import { configureHttp } from '../src/config/http.js';
import { testJwtModule, authorization } from './jwt-fixture.js';
Reflect.defineMetadata(
  'design:paramtypes',
  [LoginDto],
  AuthController.prototype,
  'login',
);
Reflect.defineMetadata(
  'design:paramtypes',
  [String, UpdateMemberDto, undefined],
  MemberController.prototype,
  'updateMe',
);
describe('Auth/profile HTTP (mock repository, real bcrypt/JWT/Guard)', () => {
  let app: INestApplication;
  const date = new Date('2026-11-14T00:00:00Z');
  const member = {
    memberId: '1',
    email: 'a@example.com',
    nickname: '본인',
    createdAt: date,
    password: '',
  };
  beforeAll(async () => {
    member.password = await bcrypt.hash('legacy', 10);
    const builder = {
      addSelect: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      getOne: vi.fn().mockResolvedValue(member),
    };
    const module = await Test.createTestingModule({
      imports: [testJwtModule],
      controllers: [MemberController, AuthController],
      providers: [
        MemberService,
        AuthService,
        {
          provide: getRepositoryToken(Member),
          useValue: {
            createQueryBuilder: () => builder,
            findOneBy: async ({ memberId }: { memberId: string }) =>
              memberId === '1' ? member : null,
            existsBy: async ({ nickname }: { nickname: string }) =>
              nickname === '다른회원',
            save: async (row: typeof member) => row,
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
  it('로그인200: 가입 복잡도 재검사 없음·공개 필드만', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: member.email, password: 'legacy' })
      .expect(200);
    expect(Object.keys(body.result).sort()).toEqual([
      'accessToken',
      'nickname',
    ]);
  });
  it.each([
    { email: 'bad', password: 'x' },
    { email: member.email, password: '' },
    { email: member.email, password: 'legacy', memberId: 2 },
  ])('로그인DTO400 %#', async (body) => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(body)
      .expect(400);
  });
  it('GET me 토큰누락401·성공200·없는회원404', async () => {
    const missing = await request(app.getHttpServer())
      .get('/members/me')
      .expect(401);
    expect(missing.body.code).toBe('AUTH401_2');
    const me = await request(app.getHttpServer())
      .get('/members/me')
      .set('Authorization', authorization('1'))
      .expect(200);
    expect(me.body.result).toEqual({
      email: member.email,
      nickname: member.nickname,
      createdAt: date.toISOString(),
    });
    const absent = await request(app.getHttpServer())
      .get('/members/me')
      .set('Authorization', authorization('999'))
      .expect(404);
    expect(absent.body.code).toBe('MEMBER404_1');
  });
  it('자기닉네임200·다른회원409·수정200', async () => {
    await request(app.getHttpServer())
      .patch('/members/me')
      .set('Authorization', authorization('1'))
      .send({ nickname: '본인' })
      .expect(200);
    const collision = await request(app.getHttpServer())
      .patch('/members/me')
      .set('Authorization', authorization('1'))
      .send({ nickname: '다른회원' })
      .expect(409);
    expect(collision.body.code).toBe('MEMBER409_1');
    await request(app.getHttpServer())
      .patch('/members/me')
      .set('Authorization', authorization('1'))
      .send({ nickname: '새닉네임' })
      .expect(200);
  });
  it.each([
    { nickname: '가' },
    { nickname: '가'.repeat(13) },
    { nickname: null },
    { nickname: '정상', email: 'forbidden@example.com' },
  ])('profile DTO400 %#', async (body) => {
    await request(app.getHttpServer())
      .patch('/members/me')
      .set('Authorization', authorization('1'))
      .send(body)
      .expect(400);
  });
});
