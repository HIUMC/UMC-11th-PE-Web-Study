// 실행: npm run build 후 node --test test/mission-apis.test.mjs
// 실제 DB를 변경하지 않고 HTTP → Controller → Service → Repository를 검증합니다.
import 'reflect-metadata';
import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';
import { DATABASE_CONNECTION } from '../dist/database.provider.js';

let app;
let calls;
let rows;
const rentalDates = { rentedAt: '2026-09-28 18:00:00', dueAt: '2026-10-05 18:00:00' };
const pool = {
  async execute(sql, values) {
    calls.push({ sql: sql.replace(/\s+/g, ' ').trim(), values });
    if (sql.includes('FROM rental')) return [[rentalDates], []];
    return [sql.trim().startsWith('SELECT') ? rows : { insertId: 42 }, []];
  },
};

before(async () => {
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(DATABASE_CONNECTION)
    .useValue(pool)
    .compile();
  app = module.createNestApplication();
  await app.init();
});

beforeEach(() => {
  calls = [];
  rows = [{ id: 10, category_id: 2, title: '테스트 도서' }];
});

after(async () => { await app?.close(); });

test('카테고리 ID를 숫자로 바인딩하고 조회 결과를 반환한다', async () => {
  const response = await request(app.getHttpServer()).get('/books/category/2').expect(200);
  assert.deepEqual(response.body, rows);
  assert.deepEqual(calls, [{ sql: 'SELECT * FROM book WHERE category_id = ?', values: [2] }]);
});

test('해당 카테고리에 도서가 없으면 빈 배열을 반환한다', async () => {
  rows = [];
  await request(app.getHttpServer()).get('/books/category/999').expect(200, []);
});

for (const id of ['abc', '0', '-1', '1.5', '9007199254740992', '1 OR 1=1']) {
  test(`잘못된 categoryId ${id}는 SQL 실행 전에 거부한다`, async () => {
    await request(app.getHttpServer()).get(`/books/category/${encodeURIComponent(id)}`).expect(400);
    assert.equal(calls.length, 0);
  });
}

test('대여 생성은 사용자·도서 ID를 바인딩하고 날짜를 DB에서 계산한다', async () => {
  const response = await request(app.getHttpServer()).post('/rentals').send({ userId: 3, bookId: 10 }).expect(201);
  assert.equal(response.body.rentalId, 42);
  assert.equal(response.body.rentedAt, rentalDates.rentedAt);
  assert.equal(response.body.dueAt, rentalDates.dueAt);
  assert.deepEqual(calls, [{
    sql: 'INSERT INTO rental (user_id, book_id, rented_at, due_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))',
    values: [3, 10],
  }, {
    sql: 'SELECT CAST(rented_at AS CHAR) AS rentedAt, CAST(due_at AS CHAR) AS dueAt FROM rental WHERE rental_id = ?',
    values: [42],
  }]);
});

for (const body of [{}, { userId: 1 }, { userId: '1', bookId: 2 }, { userId: 1, bookId: 0 }, { userId: -1, bookId: 2 }, { userId: 1.5, bookId: 2 }, { userId: null, bookId: 2 }, { userId: 1, bookId: true }, { userId: 1, bookId: 9007199254740992 }]) {
  test(`잘못된 대여 요청 ${JSON.stringify(body)}는 DB를 변경하지 않는다`, async () => {
    await request(app.getHttpServer()).post('/rentals').send(body).expect(400);
    assert.equal(calls.length, 0);
  });
}
