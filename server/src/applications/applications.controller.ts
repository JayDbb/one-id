import {
  Controller,
  Get,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { GetApplicationsDto } from './dto/get-applications.dto';
import { Application, ApplicationDetail } from './entities/application.entity';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getApplications(@Query() query: GetApplicationsDto): Promise<{
    data: Application[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.applicationsService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getApplication(@Param('id') id: string): Promise<ApplicationDetail> {
    try {
      return await this.applicationsService.findOne(id);
    } catch (error) {
      throw new NotFoundException(error.message || 'Application not found');
    }
  }
}
