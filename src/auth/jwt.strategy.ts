import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from './user.entity';

/**
 * The JwtStrategy class is a Passport strategy used for handling JWT-based authentication.
 * It extends the PassportStrategy class, using the Strategy from passport-jwt.
 * It uses the UserRepository to fetch user data.
 *
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy.
   *
   * @param {Repository<User>} userRepository - An instance of UserRepository.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      ignoreExpiration: false,
      secretOrKey: process.env.APP_JWT_SECRET,
    });
  }

  /**
   * Accepts the JWT payload as the only parameter and returns the done callback function.
   * It is used to validate the JWT and the user.
   *
   * @param {any} payload - The JWT payload.
   * @returns {Promise<User>} The user associated with the JWT.
   */
  async validate(payload: any) {
    return this.userRepository.findOneBy({ id: payload.sub });
  }
}
