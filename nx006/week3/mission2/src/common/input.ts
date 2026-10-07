import { BadRequestException } from '@nestjs/common';

export function positiveId(value: unknown, name: string): number {
  const id = typeof value === 'number' ? value : typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : NaN;
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new BadRequestException(`${name} must be a positive integer`);
  }
  return id;
}
