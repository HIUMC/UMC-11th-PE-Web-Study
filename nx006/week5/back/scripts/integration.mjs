import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { connect } from './db-connection.mjs';

// Never run destructive checks against the configured application DB.
const testName = `umc_movie_test_${randomBytes(8).toString('hex')}`;
const admin = await connect();
let db, app;
let created = false;
let checks = 0;
const passed = (name) => { checks++; console.log(`PASS ${name}`); };
try {
  await admin.query(`CREATE DATABASE ${testName} CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`);
  created = true;
  db = await connect(testName);
  for (const file of ['01-schema.sql','02-seed.sql']) await db.query(await readFile(new URL(`../sql/${file}`, import.meta.url), 'utf8'));
  const [before] = await db.query('SELECT member_id,email,nickname,created_at,updated_at FROM member ORDER BY member_id');
  await db.query(await readFile(new URL('../sql/02-seed.sql', import.meta.url), 'utf8'));
  const [after] = await db.query('SELECT member_id,email,nickname,created_at,updated_at FROM member ORDER BY member_id');
  assert.deepEqual(before,after);
  const [[count]] = await db.query('SELECT COUNT(*) AS n FROM rating'); assert.equal(count.n,'3');
  passed('seed repeat preserves members and three ratings');
  const [tables] = await db.query('SHOW TABLES'); assert.equal(tables.length,3);
  for (const table of ['member','rating','favorite']) {
    const [[ddl]] = await db.query(`SHOW CREATE TABLE ${table}`);
    const sql = ddl['Create Table'];
    assert.match(sql,/PRIMARY KEY/); assert.match(sql,/datetime NOT NULL DEFAULT CURRENT_TIMESTAMP/);
    if (table !== 'member') { assert.match(sql,/FOREIGN KEY/); assert.match(sql,/UNIQUE KEY.*member_id.*movie_id/); }
    console.log(`SCHEMA ${table}: ${sql}`);
  }
  passed('three SQL tables with PK/FK/UNIQUE and timestamp definitions');
  await db.beginTransaction();
  for (const [name,sql,args,code] of [
    ['duplicate email','INSERT INTO member(email,password,nickname) VALUES(?,?,?)',['noco@umc.com','dummy','다른닉네임'],'ER_DUP_ENTRY'],
    ['duplicate nickname','INSERT INTO member(email,password,nickname) VALUES(?,?,?)',['other@example.com','dummy','수현'],'ER_DUP_ENTRY'],
    ['duplicate rating','INSERT INTO rating(member_id,movie_id,score) VALUES(1,550,1)',[],'ER_DUP_ENTRY'],
    ['rating FK','INSERT INTO rating(member_id,movie_id,score) VALUES(9999,1,1)',[],'ER_NO_REFERENCED_ROW_2'],
    ['favorite FK','INSERT INTO favorite(member_id,movie_id) VALUES(9999,1)',[],'ER_NO_REFERENCED_ROW_2'],
  ]) { await assert.rejects(db.execute(sql,args),{code}); passed(name); }
  await db.query('INSERT INTO favorite(member_id,movie_id) VALUES(1,550)');
  await assert.rejects(db.query('INSERT INTO favorite(member_id,movie_id) VALUES(1,550)'),{code:'ER_DUP_ENTRY'});
  passed('duplicate favorite');
  await db.rollback();
  const [[collation]] = await db.query("SELECT 'A' COLLATE utf8mb4_0900_ai_ci = 'a' AS case_equal, 'a' COLLATE utf8mb4_0900_ai_ci = 'a ' AS space_equal");
  assert.equal(String(collation.case_equal),'1'); assert.equal(String(collation.space_equal),'0');
  console.log('COLLATION',JSON.stringify(collation)); passed('case insensitive / trailing space significant');
  const [fixture] = await db.execute('INSERT INTO member(email,password,nickname) VALUES(?,?,?)',['empty@example.com','dummy-not-bcrypt','평점없음']);
  process.env.DB_NAME = testName;
  process.env.CORS_MODE = 'restricted';
  const { NestFactory } = await import('@nestjs/core');
  const { AppModule } = await import('../dist/app.module.js');
  app = await NestFactory.create(AppModule,{logger:false});
  await app.listen(0,'127.0.0.1');
  const base = await app.getUrl();
  async function get(path,status) {
    const response=await fetch(base+path);
    const body=await response.json();
    assert.equal(response.status,status,`${path}: ${JSON.stringify(body)}`);
    console.log(`HTTP ${path} ${status} ${JSON.stringify(body)}`);
    return body;
  }
  for (const [kind,value,available] of [['nickname','수현',false],['nickname','새닉네임',true],['email','noco@umc.com',false],['email','unused@example.com',true]]) {
    assert.deepEqual(await get(`/members/${kind}/${encodeURIComponent(value)}`,200),{available}); passed(`${kind} ${available}`);
  }
  const ratings=await get('/members/1/ratings',200);
  assert.deepEqual(ratings.map(r=>r.ratingId),[2,1]); assert.deepEqual(ratings.map(r=>r.movieId),[155,550]);
  for (const row of ratings) {
    assert.deepEqual(Object.keys(row).sort(),['ratingId','movieId','score','comment','createdAt','updatedAt'].sort());
    assert.equal(typeof row.ratingId,'number'); assert.equal(typeof row.movieId,'number');
    assert.match(row.createdAt,/Z$/);
  }
  passed('actual MySQL bigint => JSON number, ordering, public DTO, UTC');
  assert.deepEqual(await get(`/members/${fixture.insertId}/ratings`,200),[]); passed('existing member without ratings');
  assert.equal((await get('/members/99999/ratings',404)).message,'존재하지 않는 유저입니다.'); passed('missing member');
  for (const id of ['0','-1','1.5','abc','9007199254740992']) { await get(`/members/${id}/ratings`,400); passed(`invalid member ID ${id}`); }
  await db.query("INSERT INTO rating(member_id,movie_id,score,comment) VALUES(2,9007199254740992,1,NULL)");
  await get('/members/2/ratings',500); passed('unsafe DB bigint is not rounded into JSON');
  if (process.argv.includes('--optional')) {
    for (const value of ['가','가'.repeat(13)]) { await get('/members/nickname/'+encodeURIComponent(value),400); }
    for (const value of ['가나','가'.repeat(12),'😀😀']) { await get('/members/nickname/'+encodeURIComponent(value),200); }
    for (const value of ['bad','a@b','a b@example.com']) { await get('/members/email/'+encodeURIComponent(value),400); }
    passed('optional nickname boundaries / email format');
    assert.deepEqual((await get('/members/1/ratings?page=0&size=1',200)).map(r=>r.ratingId),[2]);
    assert.deepEqual((await get('/members/1/ratings?page=1&size=1',200)).map(r=>r.ratingId),[1]);
    assert.deepEqual(await get('/members/1/ratings?page=20&size=1',200),[]);
    for (const q of ['page=-1','page=1.5','size=0','size=101','page=1000001','page=','page=0&page=1','size[x]=1']) await get('/members/1/ratings?'+q,400);
    passed('optional pagination / malformed query');
  }
  console.log(`RESULT: ${checks} checks passed (real MySQL + real Nest HTTP)`);
} finally {
  if (app) await app.close();
  if (db) await db.end();
  if (created) { await admin.query(`DROP DATABASE ${testName}`); console.log('CLEANUP: removed only generated isolated test DB'); }
  await admin.end();
}
