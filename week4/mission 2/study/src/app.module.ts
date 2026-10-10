import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity.js';
import { Category } from './entities/category.entity.js';
import { BookController } from './book.controller.js';
import { BookService } from './book.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get<string>('DB_PORT', '3306')),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'study'),
        entities: [Book, Category],
        bigNumberStrings: false,
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Book, Category]),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class AppModule {}
