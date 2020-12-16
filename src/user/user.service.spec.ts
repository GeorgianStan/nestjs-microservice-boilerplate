/**
 * * Dependencies
 */
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

/**
 * * Services
 */
import { UserService } from './user.service';

/**
 * * Entities
 */
import { User } from './entities/user.entity';

export const mockRepository = jest.fn(() => ({
  find: () =>
    new Promise((resolve, reject) => {
      resolve([{ id: 1, email: 'my-email@gmail.com' }]);
    }),
}));

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Can find all users', async () => {
    const usersFromDb: User[] = await service.findAll();

    expect(Array.isArray(usersFromDb)).toBeTruthy();
    expect(usersFromDb[0].id).toBe(1);
    expect(usersFromDb[0].email).toBe('my-email@gmail.com');
  });
});
