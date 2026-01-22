import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { FormsService } from './forms.service';
import { Form } from './entities/form.entity';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getForms(): Promise<Form[]> {
    return this.formsService.findAll();
  }
}
