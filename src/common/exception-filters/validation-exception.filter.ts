/**
 * * Dependencies
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
} from '@nestjs/common';

/**
 * * Services
 */
import { CustomResponseService } from 'src/core/custom-response/custom-response.service';

/**
 * * Types
 */
import { CustomResponse, ErrCodes } from 'src/core/custom-response/@types';

// ! This is used to catch validation pipes errors
@Catch(BadRequestException)
export class ValidationExceptionFilter
  implements ExceptionFilter<BadRequestException> {
  constructor(private readonly customResponseService: CustomResponseService) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    // * get the msg from all validation erros
    let constraints: string[] | string;

    if (typeof exception.getResponse() === 'object') {
      let err: any = exception.getResponse();
      if (err.message && Array.isArray(err.message)) constraints = err.message;
    } else {
      constraints = exception.getResponse() as string;
    }

    const err: CustomResponse<null> = this.customResponseService.buildErrorResponse(
      ErrCodes.BAD_PARAMETERS,
      constraints,
    );

    return err;
  }
}
