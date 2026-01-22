import { IsOptional, IsString } from 'class-validator';

export class GetFormRequirementsDto {
  @IsString()
  form_name!: string;

  @IsOptional()
  @IsString()
  phone_number?: string;
}
