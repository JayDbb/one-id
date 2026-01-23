import { Module } from '@nestjs/common';
import { FormRegistryController } from './form-registry.controller';
import { FormRegistryRepository } from './form-registry.repository';
import { FormRegistryService } from './form-registry.service';

@Module({
  controllers: [FormRegistryController],
  providers: [FormRegistryRepository, FormRegistryService],
})
export class FormRegistryModule {}
