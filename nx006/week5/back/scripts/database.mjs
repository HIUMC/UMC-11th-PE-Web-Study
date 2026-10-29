import { readFile } from 'node:fs/promises';
import { connect } from './db-connection.mjs';
const action = process.argv[2];
const paths = {
  prepare: ['01-schema.sql', '02-seed.sql'],
  schema: ['01-schema.sql'], seed: ['02-seed.sql'], verify: ['03-verification.sql'],
}[action];
if (!paths) throw new Error('Usage: node scripts/database.mjs prepare|schema|seed|verify');
const db = await connect();
try {
  for (const path of paths) {
    const [rows] = await db.query(await readFile(new URL(`../sql/${path}`, import.meta.url), 'utf8'));
    console.log(`${path}: completed`);
    if (action === 'verify') console.log(JSON.stringify(rows, null, 2));
  }
} catch (error) {
  await db.rollback();
  throw error;
} finally { await db.end(); }
