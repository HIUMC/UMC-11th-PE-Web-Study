import { applyDecorators, type INestApplication } from '@nestjs/common';
import {
  ApiParam,
  ApiResponse,
  type ApiResponseSchemaHost,
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';
import { FavoriteResponseDto, FavoriteStatusDto } from '../dto/favorite.dto.js';
import { MovieRecordResponseDto } from '../dto/movie-record.dto.js';
import { MemberInfoDto } from '../dto/member-info.dto.js';
import { MemberResponseDto } from '../dto/member-response.dto.js';
import { RatingResponseDto } from '../dto/rating-response.dto.js';
import { ERRORS, type ErrorKey } from '../filter/errors.js';

export function configureSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('UMC Movie API')
    .setDescription(
      '회원, 평점, 즐겨찾기와 영화 기록 API. 자물쇠가 표시된 요청은 Bearer 인증이 필요합니다.',
    )
    .setVersion('9')
    .addBearerAuth()
    .build();
  const document = () =>
    SwaggerModule.createDocument(app, options, {
      extraModels: [
        FavoriteResponseDto,
        FavoriteStatusDto,
        MemberInfoDto,
        MemberResponseDto,
        RatingResponseDto,
        MovieRecordResponseDto,
      ],
    });
  const setup = { swaggerOptions: { persistAuthorization: false } };
  SwaggerModule.setup('swagger-ui', app, document, setup);
  SwaggerModule.setup('docs', app, document, setup);
}

export function ApiMovieId() {
  return ApiParam({
    name: 'movieId',
    description: 'TMDB 영화 ID',
    schema: {
      type: 'integer',
      minimum: 1,
      maximum: Number.MAX_SAFE_INTEGER,
      example: 238,
    },
  });
}

export const nullResult = { type: 'object', nullable: true, enum: [null] };

export function ApiEnvelopeSuccess(
  status: 200 | 201,
  message: string,
  result: ApiResponseSchemaHost['schema'],
  example: unknown,
) {
  const successes = {
    isSuccess: true,
    code: `COMMON${status}`,
    message,
    result: example,
  };
  return ApiResponse({
    status,
    description: message,
    schema: {
      type: 'object',
      required: ['isSuccess', 'code', 'message', 'result'],
      properties: {
        isSuccess: { type: 'boolean', enum: [true] },
        code: { type: 'string', enum: [successes.code] },
        message: { type: 'string' },
        result,
      },
      example: successes,
    },
  });
}

export function ApiBusinessErrors(...errors: ErrorKey[]) {
  const errorsByStatus = new Map<number, Record<string, { value: unknown }>>();
  for (const key of errors) {
    const error = ERRORS[key];
    const examples = errorsByStatus.get(error.status) ?? {};
    examples[error.code] = {
      value: {
        isSuccess: false,
        code: error.code,
        message: error.message,
        result: null,
      },
    };
    errorsByStatus.set(error.status, examples);
  }

  return applyDecorators(
    ...[...errorsByStatus].map(([status, examples]) =>
      ApiResponse({
        status,
        description: Object.keys(examples).join(', '),
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['isSuccess', 'code', 'message', 'result'],
              properties: {
                isSuccess: { type: 'boolean', enum: [false] },
                code: { type: 'string', enum: Object.keys(examples) },
                message: { type: 'string' },
                result: nullResult,
              },
            },
            examples,
          },
        },
      }),
    ),
  );
}

export function ApiMovieResult(
  status: 200 | 201,
  message: string,
  result: ApiResponseSchemaHost['schema'],
  example: unknown,
  ...errors: ErrorKey[]
) {
  return applyDecorators(
    ApiEnvelopeSuccess(status, message, result, example),
    ApiBusinessErrors(
      'authMissing',
      'authInvalid',
      'authExpired',
      'invalid',
      ...errors,
    ),
  );
}
