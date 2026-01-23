import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SubmitApplicationDto {
  @IsString()
  @IsNotEmpty()
  form_id: string;

  @IsString()
  @IsNotEmpty()
  applicant_id: string;

  @IsString()
  @IsOptional()
  status?: string;
}
