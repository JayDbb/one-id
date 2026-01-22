import { Module } from '@nestjs/common';
import { ApplicantFactsController } from './applicant-facts.controller';
import { ApplicantFactsRepository } from './applicant-facts.repository';
import { ApplicantFactsService } from './applicant-facts.service';

@Module({
  controllers: [ApplicantFactsController],
  providers: [ApplicantFactsRepository, ApplicantFactsService],
  exports: [ApplicantFactsService],
})
export class ApplicantFactsModule {}
