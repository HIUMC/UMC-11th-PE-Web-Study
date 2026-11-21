import {
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';

@Injectable()
export class NicknamePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const length = Array.from(value).length;
    if (length < 2 || length > 12) {
      throw new BadRequestException('닉네임은 2~12자여야 합니다.');
    }
    return value;
  }
}

@Injectable()
export class EmailPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    // Pragmatic ASCII email syntax; no trimming/case folding and no mailbox ownership claim.
    const parts = value.split('@');
    const local = parts[0] ?? '';
    const domain = parts[1] ?? '';
    const labels = domain.split('.');
    const valid =
      parts.length === 2 &&
      value.length <= 254 &&
      local.length >= 1 &&
      local.length <= 64 &&
      /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local) &&
      !local.startsWith('.') &&
      !local.endsWith('.') &&
      !local.includes('..') &&
      labels.length >= 2 &&
      labels.every((label) =>
        /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label),
      ) &&
      /^[A-Za-z]{2,63}$/.test(labels.at(-1) ?? '');
    if (!valid)
      throw new BadRequestException('올바른 이메일 형식이어야 합니다.');
    return value;
  }
}
