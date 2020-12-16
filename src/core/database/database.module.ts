/**
 * * Dependencies
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * * Modules
 */
import { ConfigModule } from '../config/config.module';

/**
 * * Services
 */
import { ConfigService } from '../config/config.service';

/**
 * * Entities
 */
import { User } from 'src/user/entities/user.entity';

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
        entities: [User],
        // ! ALWAYS FALSE IN PROD
        synchronize: !(process.env.NODE_ENV.trim() === 'production'),
      }),
    }),
  ],
})
export class DatabaseModule {}
