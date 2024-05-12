import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { Logger } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let userRepository;

  beforeEach(async () => {
    userRepository = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);

    // Mock the Logger.error method
    jest.spyOn(Logger, 'error').mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  it('should return user if credentials are valid', async () => {
    const user = new User({ username: 'test', password: 'test' });
    userRepository.findOneBy.mockResolvedValue(user);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));
    const result = await localStrategy.validate('test', 'test');
    expect(result).toEqual(user);
  });

  it('should throw UnauthorizedException if user not found', async () => {
    userRepository.findOneBy.mockResolvedValue(null);

    await expect(localStrategy.validate('test', 'test')).rejects.toThrow();
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    const user = new User({ username: 'test', password: 'test' });
    userRepository.findOneBy.mockResolvedValue(user);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(false));
    await expect(localStrategy.validate('test', 'test')).rejects.toThrow();
  });
});
