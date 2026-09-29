import { ConfigService } from '@nestjs/config';
import { createPool, type Pool } from 'mysql2/promise';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProvider = {
  provide: DATABASE_CONNECTION,
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<Pool> => {
    const pool = createPool({
      host: config.getOrThrow<string>('DB_HOST'),
      port: Number(config.getOrThrow<string>('DB_PORT')),
      user: config.getOrThrow<string>('DB_USER'),
      password: config.get<string>('DB_PASSWORD') ?? '',
      database: config.getOrThrow<string>('DB_NAME'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: 'Z',
    });
    try {
      await pool.query('SELECT 1');
      return pool;
    } catch (error) {
      await pool.end();
      throw error;
    }
  },
};
