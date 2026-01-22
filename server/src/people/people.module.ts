import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleRepository } from './people.repository';
import { PeopleService } from './people.service';

@Module({
  controllers: [PeopleController],
  providers: [PeopleRepository, PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
