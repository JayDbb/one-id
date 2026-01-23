import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { GetEligibilityDto } from './dto/get-eligibility.dto';
import { EligibilityService } from './eligibility.service';

@Controller()
export class EligibilityController {
  constructor(private readonly eligibilityService: EligibilityService) {}

  @Get('check-eligibility')
  @HttpCode(HttpStatus.OK)
  async checkEligibility(
    @Query() query: GetEligibilityDto,
  ): Promise<string[]> {
    if (!query.phone_number) {
      throw new BadRequestException('phone_number is required');
    }

    return this.eligibilityService.findCompletedForms(query.phone_number);
  }

  @Get('check-eligibility/info')
  @HttpCode(HttpStatus.OK)
  async getEligibilityInfo(
    @Query() query: GetEligibilityDto,
  ): Promise<Record<string, unknown>[]> {
    if (!query.phone_number) {
      throw new BadRequestException('phone_number is required');
    }

    const results = await this.eligibilityService.findEligibilityInfo(
      query.phone_number,
      query.form_name,
    );

    if (results.length === 0) {
      throw new NotFoundException('No eligibility criteria found');
    }

    return results;
  }
}
