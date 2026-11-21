import {
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';

@Injectable()
export class MovieIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const id = Number(value);
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id <= 0) {
      throw new BadRequestException('movieId는 양의 안전한 정수여야 합니다.');
    }
    return String(id);
  }
}
