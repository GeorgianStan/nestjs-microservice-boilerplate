/**
 * File: get-user.dto.ts
 * Project: nest-microservice-boilerplate
 * Version:1.0.0
 * Created Date: Saturday, February 1st 2020, 1:24:51 pm
 * Author: Georgian Stan (georgian.stan8@gmail.com)
 * -----
 * Last Modified: Saturday, 1st February 2020 1:50:56 pm
 * Modified By: Georgian Stan (georgian.stan8@gmail.com>)
 * ------------------------------------
 * Javascript will save your soul!
 */

import { IsEmail, IsUUID, IsOptional } from 'class-validator';

export class GetUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsUUID()
  @IsOptional()
  id?: string;
}
