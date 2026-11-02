import {
  ArgumentsHost,
  Catch,
  HttpException,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiException, ERRORS } from './errors.js';
import { mysqlConflict } from './mysql-conflict.js';

function publicMessage(body: string | object): string | undefined {
  if (typeof body === 'string') return body;
  if (!body || typeof body !== 'object') return undefined;
  if (!('message' in body)) return undefined;
  const message: unknown = body.message;
  if (typeof message === 'string') return message;
  if (Array.isArray(message))
    return message.find((item: unknown) => typeof item === 'string');
  return undefined;
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const conflict = mysqlConflict(exception);
    if (conflict) exception = new ApiException(conflict);
    const response = host.switchToHttp().getResponse<Response>();
    let status = 500;
    let code: string = ERRORS.internal.code;
    let message: string = ERRORS.internal.message;
    if (exception instanceof HttpException && exception.getStatus() < 500) {
      status = exception.getStatus();
      code = `COMMON${status}`;
      // Express JSON parser errors may quote request contents: never echo them.
      const cause = exception.cause;
      if (
        cause instanceof SyntaxError ||
        /JSON|Unexpected token|Unexpected end|Expected property/i.test(
          exception.message,
        )
      )
        message = '올바른 JSON 요청을 보내주세요.';
      else
        message =
          publicMessage(exception.getResponse()) ?? ERRORS.invalid.message;
      if (exception instanceof ApiException) {
        const body = exception.getResponse() as { code: string };
        code = body.code;
      }
    }
    response
      .status(status)
      .json({ isSuccess: false, code, message, result: null });
  }
}
