/**
 * File: custom-res.interface.ts
 * Project: nest-microservice-boilerplate
 * Version:1.0.0
 * Created Date: Saturday, February 1st 2020, 1:24:50 pm
 * Author: Georgian Stan (georgian.stan8@gmail.com)
 * -----
 * Last Modified: Saturday, 1st February 2020 1:51:38 pm
 * Modified By: Georgian Stan (georgian.stan8@gmail.com>)
 * ------------------------------------
 * Javascript will save your soul!
 */

import { ResponseStatus } from '../enums/res-status.enum';
import { CustomError } from './custom-error.interface';

export interface CustomResponse {
  status: ResponseStatus;
  data: any;
  error: CustomError;
}
