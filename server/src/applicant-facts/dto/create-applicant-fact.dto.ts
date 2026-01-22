import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateApplicantFactDto {
  @IsNotEmpty()
  @IsString()
  field_id: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  value: string[];

  @IsOptional()
  @IsUUID()
  user_id?: string;
}
