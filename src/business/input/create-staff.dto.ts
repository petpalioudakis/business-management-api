import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  Length,
} from 'class-validator';
import { JobPositionType } from './jobPositionType';

export class CreateStaffDto {
  @Length(3, 50, { message: 'First name must be between 3 and 50 characters.' })
  first_name: string;

  @Length(3, 50, { message: 'Last name must be between 3 and 50 characters.' })
  last_name: string;

  @IsEmail()
  email: string;

  @IsEnum(JobPositionType, {
    message: 'Invalid job position provided. Use kitchen, service, or pr.',
  })
  job_position: JobPositionType;

  @IsOptional()
  @IsPhoneNumber('GB', {
    message: 'Invalid phone number provided use a GB phone number.',
    always: false,
  })
  phone_number: string;
}
