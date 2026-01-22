import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantFactsController } from './applicant-facts.controller';

describe('ApplicantFactsController', () => {
  let controller: ApplicantFactsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicantFactsController],
    }).compile();

    controller = module.get<ApplicantFactsController>(ApplicantFactsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
