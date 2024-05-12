import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
};
describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    authService = {
      getUserToken: jest.fn(),
      // @ts-ignore
      jwtService: mockJwtService,
      hashPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns a token for a valid user', async () => {
    const user = new User({
      id: 1,
      username: 'testUser',
      password: 'testPassword',
    });

    const token = 'testToken';
    jest.spyOn(authService, 'getUserToken').mockReturnValue(token);

    const result = await controller.login(user);

    expect(result).toEqual({ userId: user.id, token });
  });
});
