import {
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';

@Injectable()
export class MemberIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (
      !/^\d+$/.test(value) ||
      !Number.isSafeInteger(Number(value)) ||
      Number(value) <= 0
    ) {
      throw new BadRequestException('memberId는 양의 안전한 정수여야 합니다.');
    }
    return String(Number(value));
  }
}
