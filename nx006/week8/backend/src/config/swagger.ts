import { applyDecorators, type INestApplication } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  type ApiResponseSchemaHost,
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';
import { FavoriteResponseDto, FavoriteStatusDto } from '../dto/favorite.dto.js';
import { MovieRecordResponseDto } from '../dto/movie-record.dto.js';
import { RatingResponseDto } from '../dto/rating-response.dto.js';
import { ERRORS, type ErrorKey } from '../filter/errors.js';

export function configureSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('UMC Movie API')
    .setDescription(
      '8주차 즐겨찾기와 영화 기록 API. 자물쇠가 표시된 요청은 Bearer 인증이 필요합니다.',
    )
    .setVersion('8')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'docs',
    app,
    () =>
      SwaggerModule.createDocument(app, options, {
        extraModels: [
          FavoriteResponseDto,
          FavoriteStatusDto,
          RatingResponseDto,
          MovieRecordResponseDto,
        ],
      }),
    { swaggerOptions: { persistAuthorization: false } },
  );
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

export function ApiMovieResult(
  status: 200 | 201,
  message: string,
  result: ApiResponseSchemaHost['schema'],
  example: unknown,
  ...errors: ErrorKey[]
) {
  const successes = {
    isSuccess: true,
    code: `COMMON${status}`,
    message,
    result: example,
  };
  const errorsByStatus = new Map<number, Record<string, { value: unknown }>>();
  for (const key of [
    'authMissing',
    'authInvalid',
    'authExpired',
    'invalid',
    ...errors,
  ] as const) {
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
    ApiExtraModels(
      FavoriteResponseDto,
      FavoriteStatusDto,
      MovieRecordResponseDto,
    ),
    ApiResponse({
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
    }),
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
                result: { type: 'object', nullable: true, enum: [null] },
              },
            },
            examples,
          },
        },
      }),
    ),
  );
}
