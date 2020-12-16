/**
 * * Dependencies
 */
import { NestFactory } from '@nestjs/core';
import { Logger, INestMicroservice } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

/**
 * * Modules
 */
import { AppModule } from './app.module';

/**
 * * Services
 */

async function bootstrap() {
  const logger = new Logger('Main');

  const microservicesOptions: any = {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 8875,
    },
  };

  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    microservicesOptions,
  );

  await app.listen(async () => {
    logger.log('Microservices is listening...');
  });
}
bootstrap();
