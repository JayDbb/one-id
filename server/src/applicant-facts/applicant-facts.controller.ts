import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { ApplicantFactsService } from './applicant-facts.service';
import { CreateApplicantFactDto } from './dto/create-applicant-fact.dto';
import { GetApplicantFactDto } from './dto/get-applicant-fact.dto';
import { ApplicantFact } from './entities/applicant-fact.entity';

@Controller('applicant-facts')
export class ApplicantFactsController {
  constructor(private readonly applicantFactsService: ApplicantFactsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createApplicantFact(
    @Body() dto: CreateApplicantFactDto,
  ): Promise<ApplicantFact> {
    return this.applicantFactsService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getApplicantFacts(
    @Query() query: GetApplicantFactDto,
  ): Promise<ApplicantFact[]> {
    const results = await this.applicantFactsService.findByQuery(query);

    if (results.length === 0) {
      throw new NotFoundException(
        'No applicant facts found matching the criteria',
      );
    }

    return results;
  }
}
