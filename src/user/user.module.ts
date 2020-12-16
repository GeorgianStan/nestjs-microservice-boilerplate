/**
 * * Dependencies
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * * Modules
 */
import { CustomResponseModule } from 'src/core/custom-response/custom-response.module';

/**
 * * Types
 */
import { User } from './entities/user.entity';

/**
 * * Implementations
 */
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [CustomResponseModule, TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
