/**
 * File: app.module.ts
 * Project: nest-microservice-boilerplate
 * Version:1.0.0
 * Created Date: Saturday, February 1st 2020, 1:24:51 pm
 * Author: Georgian Stan (georgian.stan8@gmail.com)
 * -----
 * Last Modified: Saturday, 1st February 2020 1:48:32 pm
 * Modified By: Georgian Stan (georgian.stan8@gmail.com>)
 * ------------------------------------
 * Javascript will save your soul!
 */

/**
 * * Dependencies
 */
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

/**
 * * Modules
 */
import { UtilsModule } from './utils/utils.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';

/**
 * * Implementation
 */
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * * Filters
 */
import { RcpGlobalErrorFilter } from './expection-filters/rcpglobal-exception.filter';

@Module({
  imports: [UtilsModule, UserModule, DatabaseModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: RcpGlobalErrorFilter,
    },
  ],
})
export class AppModule {}
