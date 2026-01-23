import { BadRequestException, Injectable } from '@nestjs/common';
import { GetFormDto } from './dto/get-form.dto';
import { GetFormRequirementsDto } from './dto/get-form-requirements.dto';
import { FieldRegistryRow } from './entities/field-registry.entity';
import { FormRepository } from './form.repository';

@Injectable()
export class FormService {
  constructor(private readonly formRepository: FormRepository) {}

  async findFormNames(query: GetFormDto): Promise<string[]> {
    const { formName } = query;
    const results = await this.formRepository.findFormNames(formName);

    return this.removeDuplicates(results);
  }

  async findForms(query: GetFormDto): Promise<Record<string, unknown>[]> {
    const fields = this.parseFields(query.fields);
    return this.formRepository.findForms(query.formName, fields);
  }

  async findUserIdByPhoneNumber(phoneNumber: string): Promise<string | null> {
    return this.formRepository.findUserIdByPhoneNumber(phoneNumber);
  }

  async findApplicantFactsByUserId(
    userId: string,
  ): Promise<{ field_id: string; value: string[] | null }[]> {
    return this.formRepository.findApplicantFactsByUserId(userId);
  }

  async findFormRequirements(
    query: GetFormRequirementsDto,
  ): Promise<FieldRegistryRow[] | null> {
    let requiredFieldIds: string[] = [];

    if (query.form_name) {
      const policy = await this.formRepository.findFormPolicy(query.form_name);

      if (!policy) {
        return null;
      }

      const parsedPolicy = this.parsePolicy(policy);
      requiredFieldIds = this.extractRequiredFieldIds(parsedPolicy);
    } else {
      requiredFieldIds = await this.formRepository.findAllFieldRegistryFieldIds();
    }

    if (!query.phone_number) {
      return this.formRepository.findFieldRegistryRowsByIds(requiredFieldIds);
    }

    const userId = await this.formRepository.findUserIdByPhoneNumber(
      query.phone_number,
    );

    if (!userId) {
      return this.formRepository.findFieldRegistryRowsByIds(requiredFieldIds);
    }

    const filledFieldIds =
      await this.formRepository.findApplicantFieldIdsByUserId(userId);

    if (filledFieldIds.length === 0) {
      return this.formRepository.findFieldRegistryRowsByIds(requiredFieldIds);
    }

    const filledSet = new Set(filledFieldIds);
    const missingFieldIds = requiredFieldIds.filter(
      (fieldId) => !filledSet.has(fieldId),
    );

    return this.formRepository.findFieldRegistryRowsByIds(missingFieldIds);
  }

  private removeDuplicates(names: string[]): string[] {
    return Array.from(new Set(names));
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

    const allowed = new Set(['form_name', 'policy', 'shorten_name']);
    const invalidFields = parsedFields.filter((field) => !allowed.has(field));

    if (invalidFields.length > 0) {
      throw new BadRequestException(
        `Invalid fields: ${invalidFields.join(', ')}`,
      );
    }

    return parsedFields;
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
