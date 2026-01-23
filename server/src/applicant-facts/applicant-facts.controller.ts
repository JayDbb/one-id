import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
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

  @Put('fields/:fieldType')
  @HttpCode(HttpStatus.OK)
  async updateApplicantFact(
    @Param('fieldType') fieldType: string,
    @Query('phoneNumber') phoneNumber: string,
    @Body() dto: UpdateApplicantFactDto,
  ): Promise<ApplicantFact> {
    const result = await this.applicantFactsService.update(
      fieldType,
      phoneNumber,
      dto.value,
    );

    if (!result) {
      throw new NotFoundException(
        `No applicant fact found for field '${fieldType}' with the provided phone number`,
      );
    }

    return result;
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
