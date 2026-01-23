import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { GetFormRegistryDto } from './dto/get-form-registry.dto';
import { FormRegistryService } from './form-registry.service';

@Controller('form-registry')
export class FormRegistryController {
  constructor(private readonly formRegistryService: FormRegistryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getFormRegistry(
    @Query() query: GetFormRegistryDto,
  ): Promise<Record<string, unknown>[]> {
    const results = await this.formRegistryService.findAll(query);

    if (results.length === 0) {
      throw new NotFoundException('No form registry rows found');
    }

    return results;
  }
}
