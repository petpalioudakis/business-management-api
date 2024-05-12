import { IsEnum, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { BusinessType } from './bussinessType';

export class CreateBusinessDto {
  @IsString()
  @Length(3, 50)
  readonly name: string;

  @IsUrl(
    { require_protocol: true, require_host: true },
    { message: 'Invalid URL provided' },
  )
  @Length(3, 50)
  location: string;

  @IsEnum(BusinessType)
  @IsOptional()
  business_type: BusinessType;
}
