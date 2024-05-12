import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  Length,
} from 'class-validator';
import { JobPositionType } from './jobPositionType';

export class CreateStaffDto {
  @Length(3, 50)
  first_name: string;

  @Length(3, 50)
  last_name: string;

  @IsEmail()
  email: string;

  @IsEnum(JobPositionType)
  job_position: JobPositionType;

  @IsOptional()
  @IsPhoneNumber('GB', {
    message: 'Invalid phone number provided',
    always: false,
  })
  phone_number: string;
}
