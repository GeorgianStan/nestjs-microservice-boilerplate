/**
 * File: change-pwd.dto.ts
 * Project: nest-microservice-boilerplate
 * Version:1.0.0
 * Created Date: Saturday, February 1st 2020, 1:24:51 pm
 * Author: Georgian Stan (georgian.stan8@gmail.com)
 * -----
 * Last Modified: Saturday, 1st February 2020 1:50:35 pm
 * Modified By: Georgian Stan (georgian.stan8@gmail.com>)
 * ------------------------------------
 * Javascript will save your soul!
 */

import { IsString, MinLength } from 'class-validator';
import { GetUserByIdDto } from './get-user-by-id.dto';

export class ChangePwdDto extends GetUserByIdDto {
  @IsString()
  @MinLength(8)
  password: string;
}
