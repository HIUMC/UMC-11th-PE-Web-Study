import {
  BadRequestException,
  ValidationPipe,
  type INestApplication,
} from '@nestjs/common';
import { ApiExceptionFilter } from '../filter/api-exception.filter.js';

export function configureHttp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
      validationError: { target: false, value: false },
      exceptionFactory: (errors) =>
        new BadRequestException(
          errors.flatMap((error) =>
            Object.entries(error.constraints ?? {}).map(([name, message]) =>
              name === 'whitelistValidation'
                ? '허용하지 않는 입력 필드가 있습니다.'
                : message,
            ),
          ),
        ),
    }),
  );
  app.useGlobalFilters(new ApiExceptionFilter());
}
