import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { FormService } from './form.service';
import { GetFormDto } from './dto/get-form.dto';
import { GetFormRequirementsDto } from './dto/get-form-requirements.dto';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getFormNames(@Query() query: GetFormDto): Promise<string[]> {
    const results = await this.formService.findFormNames(query);

    if (results.length === 0) {
      throw new NotFoundException(
        'No form names found matching the criteria',
      );
    }

    return results;
  }

  @Get('requirements')
  @HttpCode(HttpStatus.OK)
  async getFormRequirements(
    @Query() query: GetFormRequirementsDto,
  ): Promise<string[]> {
    if (!query.form_name) {
      throw new BadRequestException('form_name is required');
    }

    const fieldIds = await this.formService.findFormRequirements(query);

    if (!fieldIds) {
      throw new NotFoundException('No form policy found matching the criteria');
    }

    return fieldIds;
  }
}
