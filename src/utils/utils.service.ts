/**
 * File: utils.service.ts
 * Project: nest-microservice-boilerplate
 * Version:1.0.0
 * Created Date: Saturday, February 1st 2020, 1:24:50 pm
 * Author: Georgian Stan (georgian.stan8@gmail.com)
 * -----
 * Last Modified: Saturday, 1st February 2020 1:49:26 pm
 * Modified By: Georgian Stan (georgian.stan8@gmail.com>)
 * ------------------------------------
 * Javascript will save your soul!
 */

/**
 * * Dependencies
 */
import { Injectable, Logger } from '@nestjs/common';

/**
 * * Implementations
 */
import { ConfigService } from '../config/config.service';

/**
 * * Types
 */
import { CustomResponse } from '../core/interfaces/custom-res.interface';
import { ResponseStatus } from '../core/enums/res-status.enum';

@Injectable()
export class UtilsService {
  private readonly logger = new Logger(UtilsService.name);

  constructor(private readonly configService: ConfigService) {
    this.logger.log('SERVICE INIT');
  }

  // * build err res
  buildErrorResponse(
    code: number,
    msg: string | string[],
    namespace = this.configService.get('ERROR_CODE_NAMESPACE'),
  ): CustomResponse {
    return {
      status: ResponseStatus.ERROR,
      data: null,
      error: {
        code,
        msg,
        namespace,
      },
    };
  }

  // * build success res
  buildSuccessResponse(data: any): CustomResponse {
    return {
      status: ResponseStatus.SUCCESS,
      data,
      error: null,
    };
  }
}
