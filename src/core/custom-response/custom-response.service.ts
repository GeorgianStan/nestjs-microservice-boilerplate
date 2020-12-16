/**
 * * Dependencies
 */
import { Injectable, Logger } from '@nestjs/common';

/**
 * * Services
 */
import { ConfigService } from '../config/config.service';

/**
 * * Types
 */
import { CustomResponse } from './@types/interfaces';
import { ResponseStatus } from './@types/enums';

@Injectable()
export class CustomResponseService {
  #logger = new Logger(CustomResponseService.name);

  constructor(private readonly configService:ConfigService) {
    this.#logger.log('Service Init');
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
      namespace: this.configService.get('ERROR_CODE_NAMESPACE'),
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
      namespace: this.configService.get('ERROR_CODE_NAMESPACE'),
    };
  }

  // * build success res
  buildSuccessResponse(data: any = ''): CustomResponse<any> {
    return {
      status: ResponseStatus.SUCCESS,
      data,
      error: null,
      namespace: this.configService.get('ERROR_CODE_NAMESPACE'),
    };
  }
}
