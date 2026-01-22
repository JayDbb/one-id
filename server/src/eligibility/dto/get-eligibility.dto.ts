import { IsOptional, IsString } from 'class-validator';

export class GetEligibilityDto {
  @IsOptional()
  @IsString()
  phone_number?: string;
}
