import { InternalServerErrorException } from '@nestjs/common';
import type { Rating } from '../entity/rating.entity.js';

export function safeId(value: string | number): number {
  const number = Number(value);
  if (
    !/^\d+$/.test(String(value)) ||
    !Number.isSafeInteger(number) ||
    number <= 0
  ) {
    throw new InternalServerErrorException();
  }
  return number;
}

export class RatingResponseDto {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;

  static from(this: void, rating: Rating): RatingResponseDto {
    return Object.assign(new RatingResponseDto(), {
      ratingId: safeId(rating.ratingId),
      movieId: safeId(rating.movieId),
      score: rating.score,
      comment: rating.comment,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    });
  }
}
