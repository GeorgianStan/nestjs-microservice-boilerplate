/**
 * * Dependencies
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';

/**
 * * Implementations
 */
import { CustomResponseService } from './custom-response.service';

@Module({
  imports: [ConfigModule],
  providers: [CustomResponseService],
  exports: [CustomResponseService],
})
export class CustomResponseModule {}
