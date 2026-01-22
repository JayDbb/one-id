import { Injectable } from '@nestjs/common';
import { GetFormDto } from './dto/get-form.dto';
import { GetFormRequirementsDto } from './dto/get-form-requirements.dto';
import { FormRepository } from './form.repository';

@Injectable()
export class FormService {
  constructor(private readonly formRepository: FormRepository) {}

  async findFormNames(query: GetFormDto): Promise<string[]> {
    const { formName } = query;
    const results = await this.formRepository.findFormNames(formName);

    return this.removeDuplicates(results);
  }

  async findFormRequirements(
    query: GetFormRequirementsDto,
  ): Promise<string[] | null> {
    const policy = await this.formRepository.findFormPolicy(query.form_name);

    if (!policy) {
      return null;
    }

    const parsedPolicy = this.parsePolicy(policy);
    return this.extractRequiredFieldIds(parsedPolicy);
  }

  private removeDuplicates(names: string[]): string[] {
    return Array.from(new Set(names));
  }

  private parsePolicy(policy: unknown | null): unknown | null {
    if (policy === null || policy === undefined) {
      return null;
    }

    if (typeof policy === 'string') {
      try {
        return JSON.parse(policy);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Invalid form policy JSON: ${message}`);
      }
    }

    return policy;
  }

  private extractRequiredFieldIds(policy: unknown | null): string[] {
    if (!policy || typeof policy !== 'object') {
      return [];
    }

    const requiredFields = (policy as { required_fields?: unknown })
      .required_fields;

    if (!Array.isArray(requiredFields)) {
      return [];
    }

    const fieldIds = requiredFields
      .map((field) => {
        if (!field || typeof field !== 'object') {
          return null;
        }
        const fieldId = (field as { field_id?: unknown }).field_id;
        return typeof fieldId === 'string' && fieldId.length > 0
          ? fieldId
          : null;
      })
      .filter((fieldId): fieldId is string => fieldId !== null);

    return Array.from(new Set(fieldIds));
  }
}
