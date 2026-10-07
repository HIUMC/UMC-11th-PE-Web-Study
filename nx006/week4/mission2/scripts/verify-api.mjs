import 'dotenv/config';
import assert from 'node:assert/strict';
import mysql from 'mysql2/promise';

const base = `http://127.0.0.1:${process.env.PORT ?? 3000}`;
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME,
  dateStrings: true,
  supportBigNumbers: true,
  bigNumberStrings: true,
});
const createdBookIds = [];
let rentalId;
const responseKeys = [
  'bookId',
  'title',
  'description',
  'categoryName',
  'isAvailable',
].sort();
const [baseline] = await db.execute('SELECT * FROM book ORDER BY book_id');
const normalize = (rows) => JSON.stringify(rows);

async function request(method, path, body, status) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  console.log(
    JSON.stringify({
      method,
      url: `${base}${path}`,
      requestBody: body ?? null,
      status: response.status,
      responseBody: data,
    }),
  );
  assert.equal(response.status, status);
  return data;
}
function checkBook(book) {
  assert.deepEqual(Object.keys(book).sort(), responseKeys);
  assert.ok(Number.isSafeInteger(book.bookId));
  assert.equal(typeof book.categoryName, 'string');
  assert.equal(typeof book.isAvailable, 'boolean');
}
try {
  const [categories] = await db.execute(
    'SELECT category_id, name FROM category ORDER BY category_id LIMIT 2',
  );
  const [users] = await db.execute(
    'SELECT user_id FROM users ORDER BY user_id LIMIT 1',
  );
  assert.ok(categories.length === 2 && users.length && baseline.length);
  const categoryId = Number(categories[0].category_id);
  const initial = await request('GET', '/books', undefined, 200);
  initial.forEach(checkBook);
  assert.equal(initial.length, baseline.length);
  assert.deepEqual(
    initial.map((b) => b.bookId),
    [...initial.map((b) => b.bookId)].sort((a, b) => b - a),
  );
  const token = `UMC4-${Date.now()}`;
  const title = `${token} O'Reilly 100%_ SQL`;
  const book = await request(
    'POST',
    '/books',
    { categoryId: String(categoryId), title },
    201,
  );
  createdBookIds.push(book.bookId);
  checkBook(book);
  assert.equal(book.description, null);
  assert.equal(book.categoryName, categories[0].name);
  assert.equal(book.isAvailable, true);
  const [stored] = await db.execute(
    'SELECT title, category_id, description, is_available FROM book WHERE book_id = ?',
    [book.bookId],
  );
  assert.equal(stored[0].title, title);
  assert.equal(Number(stored[0].category_id), categoryId);
  assert.equal(stored[0].description, null);
  assert.equal(stored[0].is_available, 1);
  console.log(
    JSON.stringify({
      check: 'ORM save persisted',
      bookId: book.bookId,
      row: stored[0],
    }),
  );
  const described = await request(
    'POST',
    '/books',
    {
      categoryId: Number(categories[1].category_id),
      title: `${token} description`,
      description: '4주차 설명 검증',
    },
    201,
  );
  createdBookIds.push(described.bookId);
  checkBook(described);
  assert.equal(described.description, '4주차 설명 검증');
  assert.equal(described.categoryName, categories[1].name);
  const after = await request('GET', '/books', undefined, 200);
  assert.equal(after[0].bookId, described.bookId);
  assert.ok(after.some((b) => b.bookId === book.bookId && b.title === title));
  for (const invalid of [
    { categoryId, title: '' },
    { categoryId, title: '   ' },
    { categoryId, title: 'a'.repeat(101) },
    { categoryId, title: 123 },
    { categoryId: 0, title: 'bad' },
    { categoryId: -1, title: 'bad' },
    { categoryId: 1.5, title: 'bad' },
    { categoryId: true, title: 'bad' },
    { categoryId: '1e0', title: 'bad' },
    { categoryId: '9007199254740992', title: 'bad' },
    { title: 'missing' },
    { categoryId, title: 'bad', description: 123 },
    { categoryId, title: 'bad', description: null },
    { categoryId, title: 'bad', isAvailable: false },
  ]) {
    const [beforeCount] = await db.execute(
      'SELECT COUNT(*) AS count FROM book',
    );
    await request('POST', '/books', invalid, 400);
    const [afterCount] = await db.execute('SELECT COUNT(*) AS count FROM book');
    assert.equal(afterCount[0].count, beforeCount[0].count);
  }
  await request(
    'POST',
    '/books',
    { categoryId: Number.MAX_SAFE_INTEGER, title: 'missing category' },
    404,
  );
  const [count] = await db.execute('SELECT COUNT(*) AS count FROM book');
  assert.equal(Number(count[0].count), baseline.length + 2);
  for (const keyword of [token, '%', '_', "O'Reilly"]) {
    const result = await request(
      'GET',
      `/books?keyword=${encodeURIComponent(keyword)}`,
      undefined,
      200,
    );
    result.forEach(checkBook);
    assert.ok(
      result.length > 0 && result.every((b) => b.title.includes(keyword)),
    );
  }
  assert.deepEqual(
    await request('GET', `/books?keyword=${token}-absent`, undefined, 200),
    [],
  );
  assert.deepEqual(
    await request('GET', '/books?keyword=%20%20%20', undefined, 200),
    after,
  );
  assert.deepEqual(
    await request(
      'GET',
      '/books?keyword=%27%20OR%201%3D1%20--',
      undefined,
      200,
    ),
    [],
  );
  await request('GET', '/books?keyword=a&keyword=b', undefined, 400);
  for (const category of categories) {
    const rows = await request(
      'GET',
      `/books/category/${category.category_id}`,
      undefined,
      200,
    );
    assert.ok(
      rows.length > 0 &&
        rows.every((b) => b.category_id === Number(category.category_id)),
    );
    assert.deepEqual(
      Object.keys(rows[0]).sort(),
      ['book_id', 'category_id', 'title', 'description', 'is_available'].sort(),
    );
  }
  const userId = Number(users[0].user_id);
  const bookId = Number(baseline[0].book_id);
  const rental = await request('POST', '/rentals', { userId, bookId }, 201);
  rentalId = rental.rentalId;
  const [beforeRental] = await db.execute(
    'SELECT rented_at, due_at, returned_at, TIMESTAMPDIFF(SECOND,rented_at,due_at) AS due_seconds FROM rental WHERE rental_id = ?',
    [rentalId],
  );
  assert.equal(Number(beforeRental[0].due_seconds), 604800);
  assert.equal(beforeRental[0].returned_at, null);
  console.log(
    JSON.stringify({
      check: 'rental regression before return',
      rentalId,
      row: beforeRental[0],
    }),
  );
  const returned = await request(
    'PATCH',
    `/rentals/${rentalId}/return`,
    undefined,
    200,
  );
  assert.equal(returned.affectedRows, 1);
  const [returnedRows] = await db.execute(
    'SELECT returned_at FROM rental WHERE rental_id = ?',
    [rentalId],
  );
  assert.ok(returnedRows[0].returned_at);
  console.log(
    JSON.stringify({
      check: 'rental regression after return',
      row: returnedRows[0],
    }),
  );
  await request('PATCH', '/rentals/999999999/return', undefined, 404);
  console.log(
    'PASS: week4 ORM, DTO, literal search, validation and legacy regression',
  );
} finally {
  if (rentalId !== undefined)
    await db.execute('DELETE FROM rental WHERE rental_id = ?', [rentalId]);
  for (const id of createdBookIds)
    await db.execute('DELETE FROM book WHERE book_id = ?', [id]);
  const [remaining] = await db.execute('SELECT * FROM book ORDER BY book_id');
  assert.equal(normalize(remaining), normalize(baseline));
  console.log(
    JSON.stringify({
      check: 'only test rows cleaned; existing books unchanged',
      baselineCount: baseline.length,
    }),
  );
  await db.end();
}
