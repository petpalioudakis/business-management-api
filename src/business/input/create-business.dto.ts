import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { BusinessType } from './bussinessType';

export class CreateBusinessDto {
  @IsString()
  @Length(3, 50, {
    message: 'Business Name must be between 3 and 50 characters.',
  })
  readonly name: string;

  @IsString()
  @Length(3, 50, {
    message: 'Business Location must be between 3 and 50 characters.',
  })
  location: string;

  @IsEnum(BusinessType, {
    message:
      'Invalid business type provided. Use restaurant, bar, hotel, club or cafe.',
  })
  @IsOptional()
  business_type: BusinessType;
}
