import mysql from 'mysql2/promise';
import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');
export async function connect(database = process.env.DB_NAME) {
  for (const name of ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']) {
    if (!process.env[name]) throw new Error(`Missing environment variable: ${name}`);
  }
  const port = Number(process.env.DB_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid DB_PORT');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST, port, user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, database,
    timezone: 'Z', supportBigNumbers: true, bigNumberStrings: true,
    charset: 'utf8mb4', multipleStatements: true,
  });
  await connection.query("SET time_zone = '+00:00'");
  return connection;
}
