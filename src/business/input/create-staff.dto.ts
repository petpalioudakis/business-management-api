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

  @Length(10, 50)
  last_name: string;

  @IsEmail()
  email: string;

  @IsEnum(JobPositionType)
  job_position: JobPositionType;

  @IsPhoneNumber('GB', { message: 'Invalid phone number provided' })
  @IsOptional()
  phone_number: string;
}
