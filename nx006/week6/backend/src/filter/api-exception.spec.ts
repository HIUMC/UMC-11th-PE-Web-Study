import { HttpException, type ArgumentsHost } from '@nestjs/common';
import { ApiExceptionFilter } from './api-exception.filter.js';

describe('공통 예외 메시지 추출', () => {
  it.each([
    '문자열 오류',
    { message: '객체 오류' },
    { message: ['첫 오류', '둘째 오류'] },
    { message: [] },
    { message: 1 },
  ])('문자열·객체·배열 %#', (body) => {
    const json = vi.fn();
    const response = { status: vi.fn().mockReturnThis(), json };
    const host = {
      switchToHttp: () => ({ getResponse: () => response }),
    } as ArgumentsHost;
    new ApiExceptionFilter().catch(new HttpException(body, 400), host);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        isSuccess: false,
        code: 'COMMON400',
        message: expect.any(String),
        result: null,
      }),
    );
  });
  it('내부 HttpException 500의 상세도 감춘다', () => {
    const json = vi.fn();
    const response = { status: vi.fn().mockReturnThis(), json };
    const host = {
      switchToHttp: () => ({ getResponse: () => response }),
    } as ArgumentsHost;
    new ApiExceptionFilter().catch(
      new HttpException('private internal SQL', 500),
      host,
    );
    expect(json.mock.calls[0][0].message).not.toContain('private');
  });
});
