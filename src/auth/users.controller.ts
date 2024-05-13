import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './input/create-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

/**
 * The UsersController is a controller that handles HTTP requests related to users.
 * It uses the AuthService and UserService to perform operations.
 *
 * @class UsersController
 */
@Controller('users')
export class UsersController {
  /**
   * Creates an instance of UsersController.
   *
   * @param {AuthService} authService - An instance of AuthService.
   * @param {UserService} userService - An instance of UserService.
   */
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * Handles the POST /users request.
   * Creates a new user.
   *
   * @param {CreateUserDto} input - The data to create the user.
   * @returns {Promise<User>} The created user with a token.
   * @throws {BadRequestException} If the passwords do not match or if the username or email is already taken.
   */
  @Post()
  async create(@Body() input: CreateUserDto) {
    if (input.password !== input.password_confirmation) {
      throw new BadRequestException({ message: 'Passwords do not match' });
    }

    const alreadyExists = await this.userService.findUserByUsernameOrEmail(
      input.username,
      input.email,
    );

    if (alreadyExists) {
      throw new BadRequestException({
        message: 'username or email is already taken',
      });
    }
    delete input.password_confirmation;
    const user = new User({
      ...input,
      password: await this.authService.hashPassword(input.password),
    });

    const savedUser = await this.userService.createUser(user);
    const token = this.authService.getUserToken(savedUser);

    return {
      userId: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
      token,
    };
  }
}
