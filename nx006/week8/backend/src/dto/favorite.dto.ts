import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';
import type { Favorite } from '../entity/favorite.entity.js';
import { safeId } from './rating-response.dto.js';

export class CreateFavoriteDto {
  @ApiProperty({
    type: 'integer',
    minimum: 1,
    maximum: Number.MAX_SAFE_INTEGER,
    example: 238,
  })
  @IsInt({ message: '영화 ID는 정수여야 합니다.' })
  @Min(1, { message: '영화 ID는 양수여야 합니다.' })
  @Max(Number.MAX_SAFE_INTEGER, {
    message: '영화 ID는 안전한 정수 범위여야 합니다.',
  })
  movieId: number;
}

export class FavoriteResponseDto {
  @ApiProperty({ type: 'integer', example: 1 })
  favoriteId: number;

  @ApiProperty({ type: 'integer', example: 238 })
  movieId: number;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2026-11-22T00:00:00.000Z',
  })
  createdAt: Date;

  static from(this: void, favorite: Favorite): FavoriteResponseDto {
    return {
      favoriteId: safeId(favorite.favoriteId),
      movieId: safeId(favorite.movieId),
      createdAt: favorite.createdAt,
    };
  }
}

export class FavoriteStatusDto {
  @ApiProperty({ type: Boolean, example: true })
  isFavorite: boolean;
}
