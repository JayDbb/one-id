import {
  Controller,
  Get,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { GetPeopleDto } from './dto/get-people.dto';
import { Person, PersonDetail } from './entities/person.entity';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPeople(@Query() query: GetPeopleDto): Promise<{
    data: Person[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.peopleService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPerson(@Param('id') id: string): Promise<PersonDetail> {
    try {
      return await this.peopleService.findOne(id);
    } catch (error) {
      throw new NotFoundException(error.message || 'Person not found');
    }
  }
}
