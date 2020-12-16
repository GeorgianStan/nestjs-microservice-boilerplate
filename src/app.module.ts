/**
 * * Dependencies
 */
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

/**
 * * Modules
 */
import { UserModule } from './user/user.module';
import { DatabaseModule } from './core/database/database.module';
import { CustomResponseModule } from './core/custom-response/custom-response.module';

/**
 * * Implementation
 */
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * * Filters
 */
import { RcpGlobalErrorFilter } from './common/exception-filters/rcpglobal-exception.filter';

@Module({
  imports: [CustomResponseModule, UserModule, DatabaseModule],
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
