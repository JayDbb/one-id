import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateApplicantFactDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  value: string[];
}
