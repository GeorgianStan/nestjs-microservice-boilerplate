/**
 * File: user.controller.ts
 * Project: nest-microservice-boilerplate
 * Version:1.0.0
 * Created Date: Saturday, February 1st 2020, 1:24:51 pm
 * Author: Georgian Stan (georgian.stan8@gmail.com)
 * -----
 * Last Modified: Saturday, 1st February 2020 1:50:21 pm
 * Modified By: Georgian Stan (georgian.stan8@gmail.com>)
 * ------------------------------------
 * Javascript will save your soul!
 */

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
import { User } from './entities/user.entity';
import { CustomResponse } from '../core/interfaces/custom-res.interface';
import { ErrCodes } from '../core/enums/error-codes.enum';

/**
 * * Implementations
 */
import { UtilsService } from '../utils/utils.service';
import { UserService } from './user.service';

/**
 * * Filters
 */
import { ValidationExceptionFilter } from '../expection-filters/validation-exception.filter';
import { DBExceptionFilter } from '../expection-filters/db-exception.filter';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly utilsService: UtilsService,
  ) {}

  // * create a new user
  @MessagePattern('create_user')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createUser(@Payload() payload: CreateUserDto) {
    const userFromDb: User = await this.userService.createUser(payload);

    const res: CustomResponse = this.utilsService.buildSuccessResponse(
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
      const res: CustomResponse = this.utilsService.buildErrorResponse(
        ErrCodes.BAD_PARAMETERS,
        'You must send at lest one search parameter',
      );
      return res;
    }

    const userFromDb: User = await this.userService.getUser(payload);

    const res: CustomResponse = this.utilsService.buildSuccessResponse(
      userFromDb || '',
    );

    return res;
  }

  // * update user password
  @MessagePattern('change_user_pwd')
  @UseFilters(ValidationExceptionFilter)
  @UsePipes(ValidationPipe)
  async changePwd(@Payload() payload: ChangePwdDto) {
    const updated: boolean = await this.userService.changePwd(payload);
    let res: CustomResponse;

    if (updated) {
      res = this.utilsService.buildSuccessResponse('');
    } else {
      res = this.utilsService.buildErrorResponse(
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
    let res: CustomResponse;

    if (updated) {
      res = this.utilsService.buildSuccessResponse('');
    } else {
      res = this.utilsService.buildErrorResponse(
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

    let res: CustomResponse;

    if (deleted) {
      res = this.utilsService.buildSuccessResponse('');
    } else {
      res = this.utilsService.buildErrorResponse(
        ErrCodes.BAD_PARAMETERS,
        'No user found to delete',
      );
    }

    return res;
  }
}
