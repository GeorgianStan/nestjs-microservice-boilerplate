/**
 * File: config.module.ts
 * Project: nest-microservice-boilerplate
 * Version:1.0.0
 * Created Date: Saturday, February 1st 2020, 1:24:50 pm
 * Author: Georgian Stan (georgian.stan8@gmail.com)
 * -----
 * Last Modified: Saturday, 1st February 2020 1:52:00 pm
 * Modified By: Georgian Stan (georgian.stan8@gmail.com>)
 * ------------------------------------
 * Javascript will save your soul!
 */

import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
