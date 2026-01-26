import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApplicantFactsService } from './applicant-facts.service';
import { CreateApplicantFactDto } from './dto/create-applicant-fact.dto';
import { GetApplicantFactDto } from './dto/get-applicant-fact.dto';
import { UpdateApplicantFactDto } from './dto/update-applicant-fact.dto';
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

  @Put()
  @HttpCode(HttpStatus.OK)
  async updateApplicantFact(
    @Body() dto: UpdateApplicantFactDto,
  ): Promise<ApplicantFact> {
    return this.applicantFactsService.update(
      dto.field_id,
      dto.phone_number,
      dto.value,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getApplicantFacts(
    @Query() query: GetApplicantFactDto,
  ): Promise<ApplicantFact[]> {
    const results = await this.applicantFactsService.findByQuery(query);

    // If querying by user_id, return empty array instead of 404
    if (results.length === 0 && query.user_id) {
      return [];
    }

    if (results.length === 0) {
      throw new NotFoundException(
        'No applicant facts found matching the criteria',
      );
    }

    return results;
  }
}
