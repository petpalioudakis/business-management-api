/**
 * The AuthController is responsible for handling authentication-related requests.
 * It uses the AuthService to perform the actual authentication logic.
 *
 * @example
 * const authController = new AuthController(authService);
 *
 * @see AuthService
 */
import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  /**
   * Constructs a new instance of the AuthController.
   *
   * @param authService - The AuthService instance to use for authentication logic.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles a login request.
   *
   * This method is guarded by the AuthGuardLocal, which means that the request must contain valid credentials.
   * If the credentials are valid, it returns a JSON object containing the user's ID and a JWT.
   *
   * @param user - The User entity of the currently authenticated user.
   *
   * @returns A Promise that resolves to an object containing the user's ID and a JWT.
   *
   * @example
   * const result = await authController.login(user);
   * console.log(result); // { userId: 1, token: '...' }
   */
  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User): Promise<{
    userId: string | number;
    username: string;
    email: string;
    token: string;
  }> {
    return {
      userId: user.id,
      username: user.username,
      email: user.email,
      token: this.authService.getUserToken(user),
    };
  }
}
