import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './input/create-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let authService: AuthService;
  let userService: UserService;
  let input: CreateUserDto;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            hashPassword: jest.fn(),
            getUserToken: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findUserByUsernameOrEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);

    input = {
      username: 'test',
      email: 'test@test.com',
      password: 'password',
      password_confirmation: 'password',
      first_name: 'test',
      last_name: 'test',
    };
    user = new User(input);
  });

  it('creates a user successfully', async () => {
    const token = 'testToken';

    jest
      .spyOn(userService, 'findUserByUsernameOrEmail')
      .mockResolvedValue(undefined);
    jest.spyOn(authService, 'hashPassword').mockResolvedValue('hashedPassword');
    jest.spyOn(userService, 'createUser').mockResolvedValue(user);
    jest.spyOn(authService, 'getUserToken').mockReturnValue(token);

    const result = await controller.create(input);

    expect(result).toEqual({ ...user, token });
  });

  it('throws an error when passwords do not match', async () => {
    input.password_confirmation = 'differentPassword';

    await expect(controller.create(input)).rejects.toThrow(BadRequestException);
  });

  it('throws an error when username or email is already taken', async () => {
    jest
      .spyOn(userService, 'findUserByUsernameOrEmail')
      .mockResolvedValue(user);

    await expect(controller.create(input)).rejects.toThrow(BadRequestException);
  });
});
