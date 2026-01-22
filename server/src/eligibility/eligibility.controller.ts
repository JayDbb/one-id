import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
}
