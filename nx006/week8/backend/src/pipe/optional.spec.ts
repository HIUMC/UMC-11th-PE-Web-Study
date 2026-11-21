import { NicknamePipe, EmailPipe } from './member-input.pipe.js';
import { PaginationPipe } from './pagination.pipe.js';

describe('선택 입력 검증', () => {
  it.each(['가나', '가'.repeat(12), '😀😀', '  '])(
    '닉네임 code point 경계 및 무정규화 %s',
    (value) => {
      expect(new NicknamePipe().transform(value)).toBe(value);
    },
  );
  it.each(['가', '가'.repeat(13), ''])('닉네임 무효 %s', (value) =>
    expect(() => new NicknamePipe().transform(value)).toThrow(),
  );
  it.each(['a+b@example.com', 'UPPER@example.co.kr'])(
    '이메일 형식 %s',
    (value) => expect(new EmailPipe().transform(value)).toBe(value),
  );
  it.each([
    'bad',
    'a@b',
    'a b@example.com',
    'a..b@example.com',
    '.a@example.com',
    'a@-example.com',
    'a@@b.com',
    'a@example.com ',
  ])('이메일 무효 %s', (value) =>
    expect(() => new EmailPipe().transform(value)).toThrow(),
  );
  it('query 없으면 페이지네이션 없음', () =>
    expect(new PaginationPipe().transform({})).toBeUndefined());
  it('부분 query 기본값', () => {
    expect(new PaginationPipe().transform({ size: '1' })).toEqual({
      page: 0,
      size: 1,
    });
    expect(new PaginationPipe().transform({ page: '1' })).toEqual({
      page: 1,
      size: 10,
    });
  });
  it.each([
    { page: '-1' },
    { page: '1.5' },
    { size: '0' },
    { size: '101' },
    { page: '1000001' },
    { page: '' },
    { size: ['1', '2'] },
    { page: {} },
    { unknown: '1' },
  ])('잘못된 query %#', (query) =>
    expect(() => new PaginationPipe().transform(query)).toThrow(),
  );
});
