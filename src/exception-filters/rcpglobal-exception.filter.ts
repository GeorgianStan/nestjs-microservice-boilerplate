/**
 * File: rcpglobal-exception.filter.ts
 * Project: nest-microservice-boilerplate
 * Version:1.0.0
 * Created Date: Saturday, February 1st 2020, 1:24:51 pm
 * Author: Georgian Stan (georgian.stan8@gmail.com)
 * -----
 * Last Modified: Saturday, 1st February 2020 2:03:08 pm
 * Modified By: Georgian Stan (georgian.stan8@gmail.com>)
 * ------------------------------------
 * Javascript will save your soul!
 */

/**
 * * Dependencies
 */
import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

/**
 * * Implementations
 */
import { UtilsService } from '../utils/utils.service';

/**
 * * types
 */
import { ErrCodes } from '../core/enums/error-codes.enum';
import { CustomResponse } from '../core/interfaces/custom-res.interface';

@Catch()
export class RcpGlobalErrorFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(RcpGlobalErrorFilter.name);

  constructor(private readonly utils: UtilsService) {
    super();
  }

  catch(exception: any, host: ArgumentsHost) {
    this.logger.error(exception);
    switch (exception.name) {
      default: {
        const res: CustomResponse = this.utils.buildErrorResponse(
          ErrCodes.UNKNOWN,
          'Unknown error',
        );
        return super.catch(new RpcException(res), host);
      }
    }
  }
}
