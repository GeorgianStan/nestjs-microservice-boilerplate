/**
 * * Dependencies
 */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { getConnection } from 'typeorm';

/**
 * * Modules
 */
import { AppModule } from '../src/app.module';

/**
 * * Implementations
 */
import { UserController } from '../src/user/user.controller';

/**
 * * Types
 */
import { CreateUserDto } from '../src/user/dto';
import { User } from '../src/user/entities/user.entity';
import {
  CustomResponse,
  ResponseStatus,
  ErrCodes,
} from '../src/core/custom-response/@types';

describe('User Microservice', () => {
  let app: INestApplication;
  let client: ClientProxy;
  let userController: UserController;

  // * store data from db
  let userFromDb: User;
  let secondUserFromDb: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          { name: 'clientToken', transport: Transport.TCP },
        ]),
      ],
    }).compile();

    userController = moduleFixture.get<UserController>(UserController);

    app = moduleFixture.createNestApplication();

    app.connectMicroservice({
      transport: Transport.TCP,
    });

    await app.startAllMicroservicesAsync();
    await app.init();

    client = app.get('clientToken');
    await client.connect();
  });

  // * close & clear db
  afterAll(async () => {
    const connection = getConnection();

    await connection.createQueryBuilder().delete().from(User).execute();

    await app.close();
    client.close();
  });

  describe('User story', () => {
    const payload: CreateUserDto = {
      email: 'myemail@email.com',
      password: '12345678',
    };

    const secondPayload: CreateUserDto = {
      email: 'mysecondemail@email.com',
      password: '12345678',
    };

    // * Validation -> no email
    it('Validaiton works when no email is present', async () => {
      const res: CustomResponse<any> = await client
        .send<CustomResponse<any>>('create_user', {
          password: payload.password,
        })
        .toPromise();

      expect(res.status).toBe(ResponseStatus.ERROR);
      expect(res.data).toBeNull();
      expect(res.error.code).toBe(ErrCodes.BAD_PARAMETERS);
    });

    // * Validation -> wrong email format
    it('Validaiton works when a wrong email format is present', async () => {
      const res: CustomResponse<any> = await client
        .send<CustomResponse<any>>('create_user', {
          email: 'wrong-email-format',
          password: payload.password,
        })
        .toPromise();

      expect(res.status).toBe(ResponseStatus.ERROR);
      expect(res.data).toBeNull();
      expect(res.error.code).toBe(ErrCodes.BAD_PARAMETERS);
    });

    // * Validation -> no password
    it('Validaiton works when no password is present', async () => {
      const res: CustomResponse<any> = await client
        .send<CustomResponse<any>>('create_user', {
          email: payload.email,
        })
        .toPromise();

      expect(res.status).toBe(ResponseStatus.ERROR);
      expect(res.data).toBeNull();
      expect(res.error.code).toBe(ErrCodes.BAD_PARAMETERS);
    });

    // * Create user
    it('Create user', async () => {
      const res: CustomResponse<any> = await client
        .send<CustomResponse<any>>('create_user', payload)
        .toPromise();

      const { data }: { data: User } = res;
      userFromDb = data;

      expect(res.status).toBe(ResponseStatus.SUCCESS);
      expect(res.error).toBeNull();
      expect(userFromDb).toBeDefined();
    });

    // * Response error when a new user with the same email
    it('Response error when a user with the same email already exits', async () => {
      const res: CustomResponse<any> = await client
        .send<CustomResponse<any>>('create_user', payload)
        .toPromise();

      expect(res.status).toBe(ResponseStatus.ERROR);
      expect(res.data).toBeNull();
      expect(res.error.code).toBe(ErrCodes.BAD_PARAMETERS);
    });

    // * Create a user with extra properties
    it('Should remove all the extra properties from createUserDto payload', async () => {
      const res: CustomResponse<any> = await client
        .send<CustomResponse<any>>('create_user', {
          ...secondPayload,
          admin: true,
        })
        .toPromise();

      const { data }: { data: User } = res;
      secondUserFromDb = data;

      expect(res.status).toBe(ResponseStatus.SUCCESS);
      expect(res.error).toBeNull();
      expect(secondUserFromDb).toBeDefined();
      //@ts-ignore
      expect(secondUserFromDb.admin).toBeUndefined();
    });

    // * Prevent - Get a user with extra properties
    it('Prevent getting a user using extra properties', async () => {
      const res: CustomResponse<any> = await client
        .send<CustomResponse<any>>('get_user', {
          createdAt: userFromDb.createdAt,
        })
        .toPromise();

      expect(res.status).toBe(ResponseStatus.ERROR);
      expect(res.data).toBeNull();
      expect(res.error.code).toBe(ErrCodes.BAD_PARAMETERS);
    });

    // * Update user data with extra properties
    it('Should remove all the extra properties from UpdateUserDataDto', async () => {
      const newEmail: string = 'new-email@email.com';

      const res: CustomResponse<any> = await client
        .send<CustomResponse<any>>('update_user_data', {
          email: newEmail,
          id: userFromDb.id,
          admin: true,
        })
        .toPromise();

      // * update user from db
      const { data }: { data: User } = await userController.getUser({
        id: userFromDb.id,
      });

      userFromDb = data;

      expect(res.status).toBe(ResponseStatus.SUCCESS);
      expect(res.error).toBeNull();
      expect(res.data).toBeFalsy();

      expect(userFromDb.email).toBe(newEmail);
      //@ts-ignore
      expect(userFromDb.admin).toBeUndefined();

      // * check if the second user remained the same
      expect(secondUserFromDb.email).toBe(secondPayload.email);
    });
  });
});
