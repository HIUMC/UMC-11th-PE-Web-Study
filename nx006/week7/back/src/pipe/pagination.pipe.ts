import {
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import type { PaginationDto } from '../dto/pagination.dto.js';

@Injectable()
export class PaginationPipe implements PipeTransform<
  Record<string, unknown>,
  PaginationDto | undefined
> {
  transform(query: Record<string, unknown>): PaginationDto | undefined {
    if (Object.keys(query).length === 0) return undefined;
    if (Object.keys(query).some((key) => key !== 'page' && key !== 'size')) {
      throw new BadRequestException('page와 size query만 지원합니다.');
    }
    const integer = (
      value: unknown,
      fallback: number,
      min: number,
      max: number,
      name: string,
    ) => {
      if (value === undefined) return fallback;
      if (
        typeof value !== 'string' ||
        !/^\d+$/.test(value) ||
        !Number.isSafeInteger(Number(value)) ||
        Number(value) < min ||
        Number(value) > max
      ) {
        throw new BadRequestException(
          `${name}는 ${min}~${max} 정수여야 합니다.`,
        );
      }
      return Number(value);
    };
    return {
      page: integer(query.page, 0, 0, 1_000_000, 'page'),
      size: integer(query.size, 10, 1, 100, 'size'),
    };
  }
}
