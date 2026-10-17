import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { databaseProviders } from "./database.provider.js";

import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";

import { BooksModule } from "./books.module.js";

import { RentalController } from "./rental.controller.js";
import { RentalService } from "./rental.service.js";
import { RentalRepository } from "./rental.repository.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.getOrThrow("DB_HOST"),
        port: 3306,
        username: configService.getOrThrow("DB_USER"),
        password: configService.getOrThrow("DB_PASSWORD"),
        database: configService.getOrThrow("DB_NAME"),

        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    BooksModule,
  ],

  controllers: [AppController, RentalController],

  providers: [
    ...databaseProviders,
    AppService,
    RentalService,
    RentalRepository,
  ],

  exports: [...databaseProviders],
})
export class AppModule {}
