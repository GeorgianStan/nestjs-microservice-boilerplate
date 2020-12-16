/**
 * * Dependencies
 */
import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

/**
 * * Services
 */
import { CustomResponseService } from 'src/core/custom-response/custom-response.service';

/**
 * * Types
 */
import { CustomResponse, ErrCodes } from 'src/core/custom-response/@types';

@Catch()
export class RcpGlobalErrorFilter extends BaseRpcExceptionFilter {
  #logger = new Logger(RcpGlobalErrorFilter.name);

  constructor(private readonly customResponseService: CustomResponseService) {
    super();
  }

  catch(exception: any, host: ArgumentsHost) {
    this.#logger.error(exception);
    switch (exception.name) {
      default: {
        const res: CustomResponse<null> = this.customResponseService.buildErrorResponse(
          ErrCodes.UNKNOWN,
          'Unknown error',
        );
        return super.catch(new RpcException(res), host);
      }
    }
  }
}
