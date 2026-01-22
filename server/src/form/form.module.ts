import { Module } from '@nestjs/common';
import { FormController } from './form.controller';
import { FormRepository } from './form.repository';
import { FormService } from './form.service';

@Module({
  controllers: [FormController],
  providers: [FormRepository, FormService],
  exports: [FormService],
})
export class FormModule {}
