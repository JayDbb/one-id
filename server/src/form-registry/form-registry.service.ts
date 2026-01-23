import { BadRequestException, Injectable } from '@nestjs/common';
import { GetFormRegistryDto } from './dto/get-form-registry.dto';
import { FormRegistryRepository } from './form-registry.repository';

@Injectable()
export class FormRegistryService {
  constructor(private readonly formRegistryRepository: FormRegistryRepository) {}

  async findAll(query: GetFormRegistryDto): Promise<Record<string, unknown>[]> {
    const fields = this.parseFields(query.fields);
    return this.formRegistryRepository.findAll(fields);
  }

  private parseFields(fields?: string): string[] | undefined {
    if (!fields) {
      return undefined;
    }

    const parsedFields = fields
      .split(',')
      .map((field) => field.trim())
      .filter((field) => field.length > 0);

    if (parsedFields.length === 0) {
      return undefined;
    }

    const allowed = new Set([
      'field_id',
      'title',
      'prompt_template',
      'type',
      'validation',
      'normalizers',
      'aliases',
      'category',
    ]);
    const ignored = new Set(['constraint']);
    const invalidFields = parsedFields.filter(
      (field) => !allowed.has(field) && !ignored.has(field),
    );

    if (invalidFields.length > 0) {
      throw new BadRequestException(
        `Invalid fields: ${invalidFields.join(', ')}`,
      );
    }

    const selected = parsedFields.filter((field) => allowed.has(field));
    return selected.length > 0 ? selected : undefined;
  }
}
