import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
import { JwtStrategy } from './jwt.strategy';
import { User } from './user.entity';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    userRepository = {
      findOneBy: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should return user if JWT is valid', async () => {
    const user = new User({ id: 5 });
    userRepository.findOneBy.mockResolvedValue(user);

    const result = await jwtStrategy.validate({ sub: 'some-sub' });

    expect(result).toEqual(user);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 'some-sub' });
  });

  it('should return null if JWT is invalid', async () => {
    userRepository.findOneBy.mockResolvedValue(null);

    const result = await jwtStrategy.validate({ sub: 'invalid-sub' });

    expect(result).toBeNull();
    expect(userRepository.findOneBy).toHaveBeenCalledWith({
      id: 'invalid-sub',
    });
  });
});
