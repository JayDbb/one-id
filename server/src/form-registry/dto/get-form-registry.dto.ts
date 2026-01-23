import { IsOptional, IsString } from 'class-validator';

export class GetFormRegistryDto {
  @IsOptional()
  @IsString()
  fields?: string;
}
