/**
 * File: validation-exception.filter.ts
 * Project: nest-microservice-boilerplate
 * Version:1.0.0
 * Created Date: Saturday, February 1st 2020, 1:24:51 pm
 * Author: Georgian Stan (georgian.stan8@gmail.com)
 * -----
 * Last Modified: Saturday, 1st February 2020 2:03:16 pm
 * Modified By: Georgian Stan (georgian.stan8@gmail.com>)
 * ------------------------------------
 * Javascript will save your soul!
 */

/**
 * * Dependencies
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
  Logger,
} from '@nestjs/common';

/**
 * * Implementations
 */
import { UtilsService } from '../utils/utils.service';

/**
 * * Types
 */
import { ErrCodes } from '../core/enums/error-codes.enum';
import { CustomResponse } from '../core/interfaces/custom-res.interface';

// ! This is used to catch validation pipes errors
@Catch(BadRequestException)
export class ValidationExceptionFilter
  implements ExceptionFilter<BadRequestException> {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  constructor(private readonly utils: UtilsService) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    // * get the msg from all validation erros
    const errs: object[] = exception.message.message.map(
      (err: any) => err.constraints,
    );

    const errMessages: string[] = errs.map(
      (err: any) => err[Object.keys(err)[0]],
    );

    const res: CustomResponse = this.utils.buildErrorResponse(
      ErrCodes.BAD_PARAMETERS,
      errMessages,
    );

    return res;
  }
}
