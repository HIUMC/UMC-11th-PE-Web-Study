import { IsInt, IsString, Max, Min, ValidateIf } from 'class-validator';
import { CodePointLength } from './validation.decorators.js';

export class UpdateRatingDto {
  @IsInt({ message: '별점은 정수여야 합니다.' })
  @Min(1, { message: '별점은 1점 이상이어야 합니다.' })
  @Max(5, { message: '별점은 5점 이하여야 합니다.' })
  score: number;

  // Omitted => null at persistence boundary; explicit null is invalid.
  @ValidateIf((_object, value) => value !== undefined)
  @IsString({ message: '후기는 문자열이어야 합니다.' })
  @CodePointLength(0, 500, { message: '후기는 500자 이하여야 합니다.' })
  comment?: string;
}

export class CreateRatingDto extends UpdateRatingDto {
  @IsInt({ message: '영화 ID는 정수여야 합니다.' })
  @Min(1, { message: '영화 ID는 양수여야 합니다.' })
  @Max(Number.MAX_SAFE_INTEGER, {
    message: '영화 ID는 안전한 정수 범위여야 합니다.',
  })
  movieId: number;
}
