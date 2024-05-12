import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    // @ts-ignore
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('finds a user by username or email', async () => {
    const user = new User({
      id: 1,
      username: 'testUser',
      password: 'testPassword',
    });
    userRepository.findOneBy.mockResolvedValue(user);

    const foundUser = await userService.findUserByUsernameOrEmail(
      'test',
      'test@test.com',
    );

    expect(foundUser).toBe(user);
    expect(userRepository.findOneBy).toHaveBeenCalledWith([
      { username: 'test' },
      { email: 'test@test.com' },
    ]);
  });

  it('returns null when user is not found', async () => {
    userRepository.findOneBy.mockResolvedValue(undefined);

    const foundUser = await userService.findUserByUsernameOrEmail(
      'test',
      'test@test.com',
    );

    expect(foundUser).toBeUndefined();
    expect(userRepository.findOneBy).toHaveBeenCalledWith([
      { username: 'test' },
      { email: 'test@test.com' },
    ]);
  });

  it('creates a new user', async () => {
    const user = new User({
      id: 1,
      username: 'testUser',
      password: 'testPassword',
    });
    userRepository.save.mockResolvedValue(user);

    const createdUser = await userService.createUser(user);

    expect(createdUser).toBe(user);
    expect(userRepository.save).toHaveBeenCalledWith(user);
  });
});
