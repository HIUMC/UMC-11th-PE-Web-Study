import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ type: 'integer', example: 4 })
  ratingId: number;
  @ApiProperty({ type: 'integer', example: 238 })
  movieId: number;
  @ApiProperty({ type: 'integer', minimum: 1, maximum: 5, example: 5 })
  score: number;
  @ApiProperty({ type: String, nullable: true })
  comment: string | null;
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
  @ApiProperty({ type: String, format: 'date-time' })
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
