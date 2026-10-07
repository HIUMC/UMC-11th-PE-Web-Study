import { positiveId } from '../common/input.js';

export interface CreateRentalInput {
  userId: number;
  bookId: number;
}

export function parseCreateRentalInput(body: Record<string, unknown> | null | undefined): CreateRentalInput {
  return {
    userId: positiveId(body?.userId, 'userId'),
    bookId: positiveId(body?.bookId, 'bookId'),
  };
}
