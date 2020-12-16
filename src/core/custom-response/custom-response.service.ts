/**
 * * Dependencies
 */
import { Injectable, Logger } from '@nestjs/common';

/**
 * * Services
 */

/**
 * * Types
 */
import { CustomResponse } from './@types/interfaces';
import { ResponseStatus } from './@types/enums';

@Injectable()
export class CustomResponseService {
  private readonly logger = new Logger(CustomResponseService.name);

  constructor() {
    this.logger.log('Service Init');
  }

  // * build err res
  buildErrorResponse(
    code: number,
    msg?: string | string[],
  ): CustomResponse<null> {
    return {
      status: ResponseStatus.ERROR,
      data: null,
      error: {
        code,
        msg,
      },
    };
  }

  // * build warnig msg
  buildWarningResponse(
    code: number,
    msg?: string | string[],
  ): CustomResponse<null> {
    return {
      status: ResponseStatus.WARNING,
      data: null,
      error: {
        code,
        msg,
      },
    };
  }

  // * build success res
  buildSuccessResponse(data: any = ''): CustomResponse<any> {
    return {
      status: ResponseStatus.SUCCESS,
      data,
      error: null,
    };
  }
}
