import { Test, TestingModule } from '@nestjs/testing';
import { FormController } from './form.controller';
import { FormService } from './form.service';

describe('FormController', () => {
  let controller: FormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormController],
      providers: [
        {
          provide: FormService,
          useValue: {
            findForms: jest.fn(),
            findFormNames: jest.fn(),
            findFormRequirements: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FormController>(FormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
