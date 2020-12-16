/**
 * * Dependencies
 */
import { Module } from '@nestjs/common';

/**
 * * Implementations
 */
import { CustomResponseService } from './custom-response.service';

@Module({
  imports: [],
  providers: [CustomResponseService],
  exports: [CustomResponseService],
})
export class CustomResponseModule {}
