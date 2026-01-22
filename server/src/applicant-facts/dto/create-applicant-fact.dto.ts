import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateApplicantFactDto {
  @IsNotEmpty()
  @IsString()
  field_id: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  value: string[];

  @IsNotEmpty()
  @IsString()
  phone_number: string;
}
