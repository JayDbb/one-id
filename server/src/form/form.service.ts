import { Injectable } from '@nestjs/common';
import { GetFormDto } from './dto/get-form.dto';
import { FormRepository } from './form.repository';

@Injectable()
export class FormService {
  constructor(private readonly formRepository: FormRepository) {}

  async findFormNames(query: GetFormDto): Promise<string[]> {
    const { formName } = query;
    const results = await this.formRepository.findFormNames(formName);

    return this.removeDuplicates(results);
  }

  private removeDuplicates(names: string[]): string[] {
    return Array.from(new Set(names));
  }
}
