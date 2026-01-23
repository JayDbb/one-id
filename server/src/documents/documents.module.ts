import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { ApplicantFactsModule } from '../applicant-facts/applicant-facts.module';

@Module({
  imports: [ApplicantFactsModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
