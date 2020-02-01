/**
 * File: main.ts
 * Project: nest-microservice-boilerplate
 * Version:1
 * Created Date: Saturday, February 1st 2020, 1:24:51 pm
 * Author: Georgian Stan (georgian.stan8@gmail.com)
 * -----
 * Last Modified: Saturday, 1st February 2020 1:35:23 pm
 * Modified By: Georgian Stan (georgian.stan8@gmail.com>)
 * ------------------------------------
 * Javascript will save your soul!
 */

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
