import { bigintNumber } from './bigint-number.js';

describe('BIGINT response conversion', () => {
  it('keeps safe IDs numeric', () => expect(bigintNumber.from('12')).toBe(12));
  it('prevents silent rounding', () =>
    expect(() => bigintNumber.from('9007199254740993')).toThrow());
});
