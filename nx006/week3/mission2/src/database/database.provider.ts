import { ConfigService } from '@nestjs/config';
import { createDatabaseConnection } from './database.connection.js';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProvider = {
  provide: DATABASE_CONNECTION,
  inject: [ConfigService],
  useFactory: createDatabaseConnection,
};
