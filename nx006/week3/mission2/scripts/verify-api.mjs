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
});

async function request(method, path, body, expectedStatus) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  console.log(JSON.stringify({ method, url: `${base}${path}`, requestBody: body ?? null, status: response.status, responseBody: data }));
  assert.equal(response.status, expectedStatus);
  return data;
}

try {
  const [users] = await db.execute('SELECT user_id FROM users ORDER BY user_id LIMIT 1');
  const [categories] = await db.execute('SELECT category_id FROM category ORDER BY category_id LIMIT 2');
  const [seedBooks] = await db.execute('SELECT book_id, category_id FROM book ORDER BY book_id LIMIT 1');
  assert.ok(users.length >= 1 && categories.length === 2 && seedBooks.length >= 1);
  const userId = users[0].user_id;
  const categoryId = categories[0].category_id;
  const otherCategoryId = categories[1].category_id;
  const bookId = seedBooks[0].book_id;
  console.log(JSON.stringify({ dbSeed: { userId, categoryId, otherCategoryId, bookId } }));

  const initialBooks = await request('GET', '/books', undefined, 200);
  assert.ok(Array.isArray(initialBooks) && initialBooks.some((book) => book.book_id === bookId));

  const title = `검증 도서 ${Date.now()}`;
  const createdBook = await request('POST', '/books', { categoryId, title, description: '자동 검증' }, 201);
  assert.equal(createdBook.message, '도서 등록이 완료되었습니다!');
  const books = await request('GET', '/books', undefined, 200);
  assert.ok(books.some((book) => book.book_id === createdBook.bookId && book.title === title));
  const [newBookRows] = await db.execute('SELECT category_id, title FROM book WHERE book_id = ?', [createdBook.bookId]);
  assert.equal(newBookRows[0]?.category_id, categoryId);
  assert.equal(newBookRows[0]?.title, title);
  console.log(JSON.stringify({ check: 'book inserted', bookId: createdBook.bookId, dbRow: newBookRows[0] }));

  for (const id of [categoryId, otherCategoryId]) {
    const filtered = await request('GET', `/books/category/${id}`, undefined, 200);
    assert.ok(filtered.length > 0 && filtered.every((book) => book.category_id === id));
    console.log(JSON.stringify({ check: 'category filter', categoryId: id, count: filtered.length, allMatch: true }));
  }

  const rental = await request('POST', '/rentals', { userId, bookId }, 201);
  const [before] = await db.execute(
    "SELECT user_id, book_id, DATE_FORMAT(rented_at, '%Y-%m-%d %H:%i:%s') AS rented_at, DATE_FORMAT(due_at, '%Y-%m-%d %H:%i:%s') AS due_at, returned_at, TIMESTAMPDIFF(SECOND, rented_at, due_at) AS due_seconds FROM rental WHERE rental_id = ?",
    [rental.rentalId],
  );
  assert.equal(before[0]?.user_id, userId);
  assert.equal(before[0]?.book_id, bookId);
  assert.equal(before[0]?.returned_at, null);
  assert.equal(before[0]?.due_seconds, 604800);
  console.log(JSON.stringify({ check: 'rental inserted', rentalId: rental.rentalId, dbRow: before[0] }));

  const returned = await request('PATCH', `/rentals/${rental.rentalId}/return`, undefined, 200);
  assert.equal(returned.affectedRows, 1);
  const [after] = await db.execute("SELECT DATE_FORMAT(returned_at, '%Y-%m-%d %H:%i:%s') AS returned_at FROM rental WHERE rental_id = ?", [rental.rentalId]);
  assert.ok(typeof after[0]?.returned_at === 'string');
  console.log(JSON.stringify({ check: 'return recorded', rentalId: rental.rentalId, before: null, after: after[0].returned_at }));

  const specialTitle = `O'Reilly; SELECT * FROM book -- ${Date.now()}`;
  const special = await request('POST', '/books', { categoryId, title: specialTitle, description: 'literal value' }, 201);
  const [specialRows] = await db.execute('SELECT title FROM book WHERE book_id = ?', [special.bookId]);
  assert.equal(specialRows[0]?.title, specialTitle);
  const [tableRows] = await db.execute('SELECT COUNT(*) AS count FROM book');
  assert.ok(tableRows[0].count >= initialBooks.length + 2);
  console.log(JSON.stringify({ check: 'special title stored literally', bookId: special.bookId, title: specialRows[0].title, bookTableCount: tableRows[0].count }));

  await request('PATCH', '/rentals/999999999/return', undefined, 404);
  await request('GET', '/books/category/1%20OR%201=1', undefined, 400);
  console.log('PASS: 10 matrix checks plus invalid ID and missing rental checks');
} finally {
  await db.end();
}
