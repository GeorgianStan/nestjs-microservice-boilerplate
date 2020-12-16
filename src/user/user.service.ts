/**
 * * Dependencies
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import bcrypt from 'bcryptjs';

/**
 * * Types
 */
import { User } from './entities/user.entity';
import {
  CreateUserDto,
  DeleteUserDto,
  GetUserDto,
  ChangePwdDto,
  UpdateUserDataDto,
} from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // * create a new user in db
  async createUser(payload: CreateUserDto): Promise<User> {
    // * hash pwd
    const password: string = await bcrypt.hash(payload.password, 10);

    // * create user and add it in db
    const user: User = new User();
    user.email = payload.email;
    user.password = password;

    const userFromDb = await this.userRepository.save(user);

    return userFromDb;
  }

  // * get one user
  async getUser(payload: GetUserDto): Promise<User | undefined> {
    let user: User;
    if (payload.id) {
      user = await this.userRepository.findOne(payload.id);
    } else {
      user = await this.userRepository.findOne({ ...payload });
    }

    return user;
  }

  // * change user pwd
  async changePwd(payload: ChangePwdDto): Promise<boolean> {
    const password: string = await bcrypt.hash(payload.password, 10);

    const res: UpdateResult = await this.userRepository.update(payload.id, {
      password,
    });

    let updated: boolean = false;

    if (res.raw.changedRows) {
      updated = true;
    }

    return updated;
  }

  // * update  user data
  async updateUserData(payload: UpdateUserDataDto): Promise<boolean> {
    const { id, ...noId } = payload;

    const res: UpdateResult = await this.userRepository.update(payload.id, {
      ...noId,
    });

    let updated: boolean = false;

    if (res.raw.changedRows) {
      updated = true;
    }

    return updated;
  }

  // * delete user from db
  async deleteUser(payload: DeleteUserDto): Promise<boolean> {
    const res: DeleteResult = await this.userRepository.delete({
      email: payload.email,
      id: payload.id,
    });

    let deleted: boolean = false;

    if (res.affected) {
      deleted = true;
    }

    return deleted;
  }

  // * find all users
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
