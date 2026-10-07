import { BadRequestException } from '@nestjs/common';
import { positiveId } from '../common/input.js';

export interface CreateBookInput {
  categoryId: number;
  title: string;
  description: string | null;
}

export function parseCreateBookInput(body: Record<string, unknown> | null | undefined): CreateBookInput {
  const categoryId = positiveId(body?.categoryId, 'categoryId');
  if (typeof body?.title !== 'string' || !body.title.trim() || body.title.length > 100) {
    throw new BadRequestException('title must be a nonempty string of at most 100 characters');
  }
  if (body.description !== undefined && body.description !== null && typeof body.description !== 'string') {
    throw new BadRequestException('description must be a string or null');
  }
  return { categoryId, title: body.title, description: body.description ?? null };
}
