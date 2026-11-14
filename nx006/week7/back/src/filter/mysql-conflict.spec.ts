import { QueryFailedError } from 'typeorm';
import { mysqlConflict } from './mysql-conflict.js';

const failure = (
  table: string,
  key: string,
  code = 'ER_DUP_ENTRY',
  errno = 1062,
) =>
  new QueryFailedError(
    `INSERT INTO \`${table}\` VALUES (?)`,
    [],
    Object.assign(new Error('private driver detail'), {
      code,
      errno,
      sqlMessage: `Duplicate entry 'private-value' for key '${table}.${key}'`,
    }),
  );
describe('MySQL 분류 (mock 오류, 실제 DB 검증은 별도)', () => {
  it.each([
    ['member', 'email', 'emailDuplicate'],
    ['member', 'nickname', 'nicknameDuplicate'],
    ['rating', 'uk_rating_member_movie', 'securedRatingDuplicate'],
  ])('%s.%s 구분', (table, key, expected) =>
    expect(mysqlConflict(failure(table, key))).toBe(expected),
  );
  it.each([
    failure('favorite', 'uk_favorite_member_movie'),
    failure('member', 'other_constraint'),
    failure('other', 'email'),
    failure('member', 'email', 'ER_NO_REFERENCED_ROW_2', 1452),
    failure('member', 'email', 'ECONNREFUSED', -1),
    new Error('ER_DUP_ENTRY'),
  ])('알 수 없는 제약·다른 테이블·FK·연결 오류는 409 아님 %#', (error) =>
    expect(mysqlConflict(error)).toBeUndefined(),
  );
});
