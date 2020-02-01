/**
 * File: user.integration.spec.ts
 * Project: nest-microservice-boilerplate
 * Version:1.0.0
 * Created Date: Saturday, February 1st 2020, 1:24:51 pm
 * Author: Georgian Stan (georgian.stan8@gmail.com)
 * -----
 * Last Modified: Saturday, 1st February 2020 1:50:16 pm
 * Modified By: Georgian Stan (georgian.stan8@gmail.com>)
 * ------------------------------------
 * Javascript will save your soul!
 */

/**
 * * Dependencies
 */
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import bcrypt from 'bcryptjs';

/**
 * * Types
 */
import { User } from './entities/user.entity';
import { CreateUserDto, GetUserDto } from './dto';
import { CustomResponse } from '../core/interfaces/custom-res.interface';
import { ResponseStatus } from '../core/enums/res-status.enum';
import { ErrCodes } from '../core/enums/error-codes.enum';

/**
 * * Modules
 */
import { UtilsModule } from '../utils/utils.module';
import { DatabaseModule } from '../database/database.module';

/**
 * * Implementations
 */
import { UserService } from './user.service';
import { UserController } from './user.controller';

describe('User Module Integration', () => {
  let controller: UserController;

  // * connect to db
  beforeAll(async () => {
    const userModule: TestingModule = await Test.createTestingModule({
      imports: [UtilsModule, DatabaseModule, TypeOrmModule.forFeature([User])],
      providers: [UserService],
      controllers: [UserController],
    }).compile();

    controller = userModule.get<UserController>(UserController);
  });

  // * close & clear db
  afterAll(async () => {
    const connection = getConnection();

    await connection
      .createQueryBuilder()
      .delete()
      .from(User)
      .execute();

    await connection.close();
  });

  describe('CRUD User', () => {
    const payload: CreateUserDto = {
      email: 'myemail@email.com',
      password: '12345678',
    };

    let userFromDb: User;

    // * create user
    it('Should create a new user', async () => {
      const startTime: number = Date.now();

      const res: CustomResponse = await controller.createUser(payload);

      const { data }: { data: User } = res;
      userFromDb = data;

      const pwdMatch: boolean = await bcrypt.compare(
        payload.password,
        userFromDb.password,
      );

      expect(res.status).toBe(ResponseStatus.SUCCESS);
      expect(res.error).toBeNull();

      expect(userFromDb.email).toBe(payload.email);
      expect(pwdMatch).toBeTruthy();
      expect(new Date(userFromDb.createdAt).getTime()).toBeGreaterThan(
        startTime,
      );
      expect(new Date(userFromDb.createdAt).getTime()).toBeLessThan(Date.now());
    });

    // * throw error if you want to create another user with the same email
    it('Creating another user with the same email should throw an error', async () => {
      try {
        await controller.createUser(payload);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    // * get a user by email and id
    it('Should get a user by email, id, email & id', async () => {
      const getUserById: GetUserDto = {
        id: userFromDb.id,
      };

      const getUserByIdEmail: GetUserDto = {
        email: payload.email,
      };

      const getUserByIdAndEmail: GetUserDto = {
        id: userFromDb.id,
        email: payload.email,
      };

      const { data: userById }: { data: User } = await controller.getUser(
        getUserById,
      );

      const { data: userByEmail }: { data: User } = await controller.getUser(
        getUserByIdEmail,
      );

      const {
        data: userByIdAndEmail,
      }: { data: User } = await controller.getUser(getUserByIdAndEmail);

      expect(userById).toEqual(userByEmail);
      expect(userById).toEqual(userByIdAndEmail);
      expect(userByEmail).toEqual(userByIdAndEmail);
    });

    // * return no data when no user is found
    it('No user found when email is wrong', async () => {
      const res: CustomResponse = await controller.getUser({
        email: 'nouser@email.com',
      });

      expect(res.status).toBe(ResponseStatus.SUCCESS);
      expect(res.data).toBe('');
      expect(res.data).toBeFalsy();
      expect(res.error).toBeNull();
    });

    // * Change user pwd
    it('Change user pwd', async () => {
      const newPwd: string = 'new-pwd';

      const res: CustomResponse = await controller.changePwd({
        id: userFromDb.id,
        password: newPwd,
      });

      expect(res.status).toBe(ResponseStatus.SUCCESS);
      expect(res.data).toBe('');
      expect(res.data).toBeFalsy();
      expect(res.error).toBeNull();

      // * update user and check if pwd was changed
      const { data: updatedUser }: { data: User } = await controller.getUser({
        id: userFromDb.id,
      });

      userFromDb = updatedUser;

      const pwdMatch: boolean = await bcrypt.compare(
        newPwd,
        userFromDb.password,
      );
      expect(pwdMatch).toBeTruthy();
    });

    // * Error response when no user if found to change pwd
    it("Error response when no user is found to change it's pwd", async () => {
      const newPwd: string = 'new-pwd';

      const res: CustomResponse = await controller.changePwd({
        id: 'wrong-random-id-00',
        password: newPwd,
      });

      expect(res.status).toBe(ResponseStatus.ERROR);
      expect(res.data).toBeNull();
      expect(res.error.code).toBe(ErrCodes.BAD_PARAMETERS);
      expect(res.error.msg.length).toBeGreaterThan(0);
    });

    // * update user data
    it('Update user data(personal info)', async () => {
      const newEmail: string = 'newEmail@email.com';

      const res: CustomResponse = await controller.updateUserData({
        id: userFromDb.id,
        email: newEmail,
      });

      expect(res.status).toBe(ResponseStatus.SUCCESS);
      expect(res.data).toBe('');
      expect(res.data).toBeFalsy();
      expect(res.error).toBeNull();

      // * update user and check if email was changed
      const { data: updatedUser }: { data: User } = await controller.getUser({
        id: userFromDb.id,
      });

      userFromDb = updatedUser;

      expect(userFromDb.email).toBe(newEmail);
    });

    // * Error response when no user if found to change it's data
    it("Error response when no user is found to change it's data", async () => {
      const newEmail: string = 'newEmail@email.com';

      const res: CustomResponse = await controller.updateUserData({
        id: userFromDb.id,
        email: newEmail,
      });

      expect(res.status).toBe(ResponseStatus.ERROR);
      expect(res.data).toBeNull();
      expect(res.error.code).toBe(ErrCodes.BAD_PARAMETERS);
      expect(res.error.msg.length).toBeGreaterThan(0);
    });

    // * Error response when no user is found to be deleted (wrong id)
    it('Error response when no user is found to be deleted - wrong id', async () => {
      const res: CustomResponse = await controller.deleteUser({
        id: 'wrong-random-id-00',
        email: userFromDb.email,
      });

      expect(res.status).toBe(ResponseStatus.ERROR);
      expect(res.data).toBeNull();
      expect(res.error.code).toBe(ErrCodes.BAD_PARAMETERS);
      expect(res.error.msg.length).toBeGreaterThan(0);
    });

    // * Error response when no user is found to be deleted (wrong email)
    it('Error response when no user is found to be deleted - wrong email', async () => {
      const res: CustomResponse = await controller.deleteUser({
        id: userFromDb.id,
        email: 'wrong email',
      });

      expect(res.status).toBe(ResponseStatus.ERROR);
      expect(res.data).toBeNull();
      expect(res.error.code).toBe(ErrCodes.BAD_PARAMETERS);
      expect(res.error.msg.length).toBeGreaterThan(0);
    });

    // * Delete user and check response
    it('Should delete an user when email + id matches', async () => {
      const res: CustomResponse = await controller.deleteUser({
        id: userFromDb.id,
        email: userFromDb.email,
      });

      expect(res.status).toBe(ResponseStatus.SUCCESS);
      expect(res.data).toBe('');
      expect(res.data).toBeFalsy();
      expect(res.error).toBeNull();
    });

    // * check if db is empty
    it('The user was deleted from db', async () => {
      const res: CustomResponse = await controller.getUser({
        id: userFromDb.id,
      });

      expect(res.status).toBe(ResponseStatus.SUCCESS);
      expect(res.data).toBe('');
      expect(res.data).toBeFalsy();
      expect(res.error).toBeNull();
    });
  });
});
