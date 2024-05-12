import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

/**
 * The UserService is a service that handles operations related to users.
 * It uses the UserRepository to perform database operations.
 *
 * @class UserService
 */
@Injectable()
export class UserService {
  /**
   * Creates an instance of UserService.
   *
   * @param {Repository<User>} userRepository - An instance of UserRepository.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Finds a user by username or email.
   *
   * @param {string} username - The username of the user.
   * @param {string} email - The email of the user.
   * @returns {Promise<User>} The user if found, otherwise null.
   */
  async findUserByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User> {
    return await this.userRepository.findOneBy([{ username }, { email }]);
  }

  /**
   * Creates a new user.
   *
   * @param {User} user - The user to create.
   * @returns {Promise<User>} The created user.
   */
  async createUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
