import { IsString } from 'class-validator';

export class GetFormRequirementsDto {
  @IsString()
  form_name!: string;
}
