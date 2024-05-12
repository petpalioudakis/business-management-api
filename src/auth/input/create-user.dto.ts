import { IsEmail, Length } from 'class-validator';
/**
 * The CreateUserDto class is a data transfer object that represents the user data required to create a new user.
 * It uses class-validator decorators for validation.
 *
 * @class CreateUserDto
 */
export class CreateUserDto {
  @Length(5, 20)
  username: string;
  @Length(8, 16)
  password: string;
  @Length(8, 16)
  password_confirmation: string;
  @IsEmail()
  email: string;
  @Length(2, 100)
  first_name: string;
  @Length(2, 100)
  last_name: string;
}
