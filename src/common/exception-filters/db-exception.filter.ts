/**
 * * Dependencies
 */
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

/**
 * * Services
 */
import { CustomResponseService } from 'src/core/custom-response/custom-response.service';

/**
 * * Types
 */
import { CustomResponse, ErrCodes } from 'src/core/custom-response/@types';

@Catch(QueryFailedError)
export class DBExceptionFilter implements ExceptionFilter {
  constructor(private readonly customResponseService: CustomResponseService) {}

  catch(exception: any, host: ArgumentsHost) {
    switch (exception.code) {
      case 'ER_DUP_ENTRY': {
        let message: string;
        if (exception.message.includes('email_1')) {
          message = 'This email is taken';
        }

        const res: CustomResponse<null> = this.customResponseService.buildErrorResponse(
          ErrCodes.BAD_PARAMETERS,
          message,
        );

        return res;
      }

      default: {
        const res: CustomResponse<null> = this.customResponseService.buildErrorResponse(
          ErrCodes.DATABASE_ERROR,
          'Unknown database error',
        );

        return res;
      }
    }
  }
}
