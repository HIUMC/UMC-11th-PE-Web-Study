import fs from "node:fs";
import mysql from "mysql2/promise";

const env = Object.fromEntries(
  fs
    .readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
    }),
);

const connection = await mysql.createConnection({
  host: env.DB_HOST,
  port: Number(env.DB_PORT || 3306),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});

const quote = String.fromCharCode(96);
const databaseName = env.DB_NAME.replaceAll(quote, quote + quote);

await connection.query(
  `CREATE DATABASE IF NOT EXISTS ${quote}${databaseName}${quote} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
);
await connection.end();

console.log(`Database ready: ${env.DB_NAME}`);
