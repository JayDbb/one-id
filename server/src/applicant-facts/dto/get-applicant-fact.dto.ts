import { IsOptional, IsString } from 'class-validator';

export class GetApplicantFactDto {
  @IsOptional()
  @IsString()
  trn?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
