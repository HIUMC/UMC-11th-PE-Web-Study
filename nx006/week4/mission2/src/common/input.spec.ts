import { BadRequestException } from '@nestjs/common';
import { positiveId } from './input.js';

describe('positiveId', () => {
  it('accepts numeric IDs from a path or JSON body', () => {
    expect(positiveId('12', 'id')).toBe(12);
    expect(positiveId(12, 'id')).toBe(12);
  });

  it('rejects values that could bypass integer validation', () => {
    for (const value of ['1 OR 1=1', '1.5', 0, -1, null, '9007199254740992']) {
      expect(() => positiveId(value, 'id')).toThrow(BadRequestException);
    }
  });
});
