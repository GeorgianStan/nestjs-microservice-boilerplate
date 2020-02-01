/**
 * File: database.module.ts
 * Project: nest-microservice-boilerplate
 * Version:1.0.0
 * Created Date: Saturday, February 1st 2020, 1:24:51 pm
 * Author: Georgian Stan (georgian.stan8@gmail.com)
 * -----
 * Last Modified: Saturday, 1st February 2020 1:51:33 pm
 * Modified By: Georgian Stan (georgian.stan8@gmail.com>)
 * ------------------------------------
 * Javascript will save your soul!
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_SERVER_HOST'),
        port: Number(configService.get('DB_SERVER_PORT')),
        username: configService.get('DB_SERVER_USERNAME'),
        password: configService.get('DB_SERVER_PASSWORD'),
        database: configService.get('DATABASE'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        // ! ALWAYS FALSE IN PROD
        synchronize: !(process.env.NODE_ENV.trim() === 'production'),
      }),
    }),
  ],
})
export class DatabaseModule {}
