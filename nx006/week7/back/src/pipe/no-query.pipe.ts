import {
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
@Injectable()
export class NoQueryPipe implements PipeTransform {
  transform(value: Record<string, unknown>): void {
    if (Object.keys(value).length)
      throw new BadRequestException('이 요청은 query를 받지 않습니다.');
  }
}
