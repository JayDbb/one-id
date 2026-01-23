import { Module } from '@nestjs/common';
import { ApplicationsModule } from '../applications/applications.module';
import { FormModule } from '../form/form.module';
import { EligibilityController } from './eligibility.controller';
import { EligibilityService } from './eligibility.service';

@Module({
  imports: [FormModule, ApplicationsModule],
  controllers: [EligibilityController],
  providers: [EligibilityService],
})
export class EligibilityModule {}
