export function validateEnvironment(env: Record<string, unknown>) {
  if (typeof env.JWT_SECRET !== 'string' || env.JWT_SECRET.length < 32)
    throw new Error('JWT_SECRET은 32자 이상이어야 합니다.');
  if (
    !/^[1-9]\d*$/.test(String(env.JWT_ACCESS_EXPIRATION)) ||
    !Number.isSafeInteger(Number(env.JWT_ACCESS_EXPIRATION))
  )
    throw new Error(
      'JWT_ACCESS_EXPIRATION은 초 단위 양의 안전한 정수여야 합니다.',
    );
  for (const name of ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_NAME']) {
    if (typeof env[name] !== 'string' || env[name] === '') {
      throw new Error(`필수 환경 변수 ${name}이 누락되었습니다.`);
    }
  }
  if (typeof env.DB_PASSWORD !== 'string')
    throw new Error('필수 환경 변수 DB_PASSWORD가 누락되었습니다.');
  const port = (value: unknown, name: string) => {
    if (
      !/^\d+$/.test(String(value)) ||
      Number(value) < 1 ||
      Number(value) > 65535
    ) {
      throw new Error(`${name}은 1~65535 정수여야 합니다.`);
    }
    return Number(value);
  };
  const mode = env.CORS_MODE ?? 'restricted';
  if (
    typeof mode !== 'string' ||
    !['restricted', 'off', 'all'].includes(mode)
  ) {
    throw new Error('CORS_MODE는 restricted/off/all 중 하나여야 합니다.');
  }
  if (env.NODE_ENV === 'production' && mode !== 'restricted') {
    throw new Error('CORS 실습 모드는 production에서 사용할 수 없습니다.');
  }
  const rawOrigins =
    env.CORS_ORIGINS ??
    'http://localhost:5173,http://localhost:5174,http://localhost:5176';
  if (typeof rawOrigins !== 'string')
    throw new Error('CORS_ORIGINS는 문자열이어야 합니다.');
  const origins = rawOrigins.split(',');
  for (const origin of origins) {
    try {
      const url = new URL(origin);
      if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin)
        throw new Error();
    } catch {
      throw new Error(
        'CORS_ORIGINS에는 경로 없는 정확한 HTTP origin을 입력하세요.',
      );
    }
  }
  return {
    ...env,
    DB_PASSWORD: env.DB_PASSWORD,
    JWT_ACCESS_EXPIRATION: Number(env.JWT_ACCESS_EXPIRATION),
    DB_PORT: port(env.DB_PORT, 'DB_PORT'),
    PORT: port(env.PORT ?? '3000', 'PORT'),
    CORS_MODE: mode,
    CORS_ORIGINS: origins.join(','),
  };
}
