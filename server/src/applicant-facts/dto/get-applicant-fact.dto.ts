import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetApplicantFactDto {
  @IsOptional()
  @IsString()
  trn?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsUUID()
  user_id?: string;
}
