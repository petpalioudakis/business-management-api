import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

/**
 * The AuthService is a service that provides authentication-related methods.
 * It uses the JwtService for JWT-related operations and bcrypt for password hashing.
 *
 * @class AuthService
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService.
   *
   * @param {JwtService} jwtService - An instance of JwtService.
   */
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates a JWT for a user.
   *
   * @param {User} user - The user for whom to generate the token.
   * @returns {string} The generated JWT.
   */
  public getUserToken(user: User): string {
    return this.jwtService.sign({ username: user.username, sub: user.id });
  }

  /**
   * Hashes a password using bcrypt.
   *
   * @param {string} password - The password to hash.
   * @returns {Promise<string>} The hashed password.
   */
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }
}
