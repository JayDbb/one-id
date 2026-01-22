import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { FormService } from './form.service';
import { GetFormDto } from './dto/get-form.dto';

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
}
