import { IsOptional, IsString } from 'class-validator';

export class GetFormDto {
  @IsOptional()
  @IsString()
  formName?: string;
}
