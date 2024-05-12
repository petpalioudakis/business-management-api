import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

/**
 * The LocalStrategy class is a Passport strategy used for handling local authentication.
 * It extends the PassportStrategy class, using the Strategy from passport-local.
 * It uses the UserRepository to fetch user data.
 *
 * @class LocalStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Logger instance to log information, warnings, errors etc.
   *
   * @private
   * @type {Logger}
   */
  private readonly logger = new Logger(LocalStrategy.name);

  /**
   * Creates an instance of LocalStrategy.
   *
   * @param {Repository<User>} userRepository - An instance of UserRepository.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  /**
   * Accepts the username and password as parameters.
   * It is used to validate the user's credentials.
   *
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<any>} The user if the credentials are valid, throws an UnauthorizedException otherwise.
   */
  public async validate(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      this.logger.error('User not found');
      throw new UnauthorizedException();
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.error('Invalid credentials');
      throw new UnauthorizedException();
    }

    return user;
  }
}
