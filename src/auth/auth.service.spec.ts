import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('@nestjs/jwt');
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('generates a token for a user', async () => {
    const user = new User({ id: 5 });
    user.id = 1;
    user.username = 'testUser';

    const token = 'testToken';
    jest.spyOn(jwtService, 'sign').mockReturnValue(token);

    const result = authService.getUserToken(user);

    expect(result).toEqual(token);
    expect(jwtService.sign).toHaveBeenCalledWith({
      username: user.username,
      sub: user.id,
    });
  });

  it('hashes a password', async () => {
    const password = 'testPassword';
    const hashedPassword = 'hashedPassword';

    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve(hashedPassword));

    const result = await authService.hashPassword(password);

    expect(result).toEqual(hashedPassword);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
  });
});
