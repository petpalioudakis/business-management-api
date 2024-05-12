import { IsEnum, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { BusinessType } from './bussinessType';

export class CreateBusinessDto {
  @IsString()
  @Length(3, 50)
  readonly name: string;

  @IsString()
  @Length(3, 50)
  location: string;

  @IsEnum(BusinessType)
  @IsOptional()
  business_type: BusinessType;
}
