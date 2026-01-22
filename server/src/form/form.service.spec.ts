import { Test, TestingModule } from '@nestjs/testing';
import { FormRepository } from './form.repository';
import { FormService } from './form.service';

describe('FormService', () => {
  let service: FormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormService,
        {
          provide: FormRepository,
          useValue: { findFormNames: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<FormService>(FormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
