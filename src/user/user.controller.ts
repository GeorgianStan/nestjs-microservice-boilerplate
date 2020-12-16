/**
 * * Dependencies
 */
import {
  Controller,
  UsePipes,
  ValidationPipe,
  UseFilters,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

/**
 * * Types
 */
import {
  CreateUserDto,
  DeleteUserDto,
  GetUserDto,
  ChangePwdDto,
  UpdateUserDataDto,
} from './dto';
import { CustomResponse, ErrCodes } from 'src/core/custom-response/@types';

/**
 * * Entity
 */
import { User } from './entities/user.entity';

/**
 * * Services
 */
import { UserService } from './user.service';
import { CustomResponseService } from 'src/core/custom-response/custom-response.service';

/**
 * * Filters
 */
import { ValidationExceptionFilter } from '../common/exception-filters/validation-exception.filter';
import { DBExceptionFilter } from '../common/exception-filters/db-exception.filter';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly customResponseService: CustomResponseService,
  ) {}

  // * create a new user
  @MessagePattern('create_user')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createUser(@Payload() payload: CreateUserDto) {
    const userFromDb: User = await this.userService.createUser(payload);

    const res: CustomResponse<User> = this.customResponseService.buildSuccessResponse(
      userFromDb,
    );

    return res;
  }

  // * get one user
  @MessagePattern('get_user')
  @UseFilters(ValidationExceptionFilter)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getUser(@Payload() payload: GetUserDto) {
    if (!Object.keys(payload).length) {
      const res: CustomResponse<null> = this.customResponseService.buildErrorResponse(
        ErrCodes.BAD_PARAMETERS,
        'You must send at lest one search parameter',
      );
      return res;
    }

    const userFromDb: User | undefined = await this.userService.getUser(
      payload,
    );

    const res: CustomResponse<
      User | undefined
    > = this.customResponseService.buildSuccessResponse(userFromDb);

    return res;
  }

  // * update user password
  @MessagePattern('change_user_pwd')
  @UseFilters(ValidationExceptionFilter)
  @UsePipes(ValidationPipe)
  async changePwd(@Payload() payload: ChangePwdDto) {
    const updated: boolean = await this.userService.changePwd(payload);
    let res: CustomResponse<null>;

    if (updated) {
      res = this.customResponseService.buildSuccessResponse();
    } else {
      res = this.customResponseService.buildErrorResponse(
        ErrCodes.BAD_PARAMETERS,
        'No user found to update',
      );
    }

    return res;
  }

  // * update user data
  @MessagePattern('update_user_data')
  @UseFilters(ValidationExceptionFilter)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateUserData(@Payload() payload: UpdateUserDataDto) {
    const updated: boolean = await this.userService.updateUserData(payload);
    let res: CustomResponse<null>;

    if (updated) {
      res = this.customResponseService.buildSuccessResponse();
    } else {
      res = this.customResponseService.buildErrorResponse(
        ErrCodes.BAD_PARAMETERS,
        'No user found to update',
      );
    }

    return res;
  }

  // * delete a user
  @MessagePattern('delete_user')
  @UseFilters(ValidationExceptionFilter)
  @UsePipes(ValidationPipe)
  async deleteUser(@Payload() payload: DeleteUserDto) {
    const deleted: boolean = await this.userService.deleteUser(payload);

    let res: CustomResponse<null>;

    if (deleted) {
      res = this.customResponseService.buildSuccessResponse();
    } else {
      res = this.customResponseService.buildErrorResponse(
        ErrCodes.BAD_PARAMETERS,
        'No user found to delete',
      );
    }

    return res;
  }
}
