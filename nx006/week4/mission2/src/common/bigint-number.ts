import type { ValueTransformer } from 'typeorm';

export const bigintNumber: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string | number) => {
    const number = Number(value);
    if (!Number.isSafeInteger(number))
      throw new Error('DB ID exceeds the safe integer range');
    return number;
  },
};
