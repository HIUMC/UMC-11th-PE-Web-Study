import 'reflect-metadata';
import 'dotenv/config';
import assert from 'node:assert/strict';
import mysql from 'mysql2/promise';
import { NestFactory } from '@nestjs/core';

const originalName = process.env.DB_NAME;
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ?? '',
});
let created = false;
let app;
try {
  // Refuse to overwrite any pre-existing database; only this invocation's schema is removed.
  await db.execute(
    'CREATE DATABASE umc_week4_empty_verify CHARACTER SET utf8mb4',
  );
  created = true;
  await db.execute(
    'CREATE TABLE umc_week4_empty_verify.category LIKE umc_books_week2.category',
  );
  await db.execute(
    'CREATE TABLE umc_week4_empty_verify.book LIKE umc_books_week2.book',
  );
  process.env.DB_NAME = 'umc_week4_empty_verify';
  const { AppModule } = await import('../dist/app.module.js');
  const { createValidationPipe } = await import('../dist/common/validation.js');
  app = await NestFactory.create(AppModule, {
    logger: false,
    abortOnError: false,
  });
  app.useGlobalPipes(createValidationPipe());
  await app.listen(3001, '127.0.0.1');
  const response = await fetch('http://127.0.0.1:3001/books');
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(data, []);
  console.log(
    JSON.stringify({
      check: 'real empty-table GET',
      status: response.status,
      responseBody: data,
      isolatedDatabase: 'umc_week4_empty_verify',
    }),
  );
} finally {
  if (app) await app.close();
  process.env.DB_NAME = originalName;
  if (created) await db.execute('DROP DATABASE umc_week4_empty_verify');
  await db.end();
}
