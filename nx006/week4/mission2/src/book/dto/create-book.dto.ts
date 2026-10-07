import { Transform } from 'class-transformer';
import {
  IsInt,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateBookDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && /^[1-9]\d*$/.test(value)
      ? Number(value)
      : value,
  )
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  categoryId: number;

  @IsString()
  @Matches(/\S/, { message: 'title must contain a non-whitespace character' })
  @MaxLength(100)
  title: string;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsString()
  description?: string;
}
