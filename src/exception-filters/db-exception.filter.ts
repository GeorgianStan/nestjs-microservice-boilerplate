/**
 * File: db-exception.filter.ts
 * Project: nest-microservice-boilerplate
 * Version:1.0.0
 * Created Date: Saturday, February 1st 2020, 1:24:51 pm
 * Author: Georgian Stan (georgian.stan8@gmail.com)
 * -----
 * Last Modified: Thursday, 9th April 2020 10:25:19 pm
 * Modified By: Georgian Stan (georgian.stan8@gmail.com>)
 * ------------------------------------
 * Javascript will save your soul!
 */

/**
 * * Dependencies
 */
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

/**
 * * Implementations
 */
import { UtilsService } from '../utils/utils.service';

/**
 * * Types
 */
import { ErrCodes } from '../core/enums/error-codes.enum';
import { CustomResponse } from 'src/core/interfaces/custom-res.interface';

@Catch(QueryFailedError)
export class DBExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DBExceptionFilter.name);

  constructor(private readonly utils: UtilsService) {}

  catch(exception: any, host: ArgumentsHost) {
    switch (exception.code) {
      case 'ER_DUP_ENTRY': {
        let message: string;
        if (exception.message.includes('email_1')) {
          message = 'This email is taken';
        }

        const res: CustomResponse = this.utils.buildErrorResponse(
          ErrCodes.BAD_PARAMETERS,
          message,
        );

        return res;
      }

      default: {
        const res: CustomResponse = this.utils.buildErrorResponse(
          ErrCodes.DATABASE_ERROR,
          'Unknown database error',
        );

        return res;
      }
    }
  }
}
