import { ResponseStatus } from '../enums/res-status.enum';
import { ErrCodes } from '../enums/err-codes.enum';

export interface CustomError {
  code: ErrCodes;
  msg?: string | string[];
}

export interface CustomResponse<T> {
  status: ResponseStatus;
  data: T;
  error: CustomError;
}
