import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantFactsService } from './applicant-facts.service';

describe('ApplicantFactsService', () => {
  let service: ApplicantFactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicantFactsService],
    }).compile();

    service = module.get<ApplicantFactsService>(ApplicantFactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
