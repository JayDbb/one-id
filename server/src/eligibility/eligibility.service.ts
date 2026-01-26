import { Injectable } from '@nestjs/common';
import { ApplicationsService } from '../applications/applications.service';
import { FormService } from '../form/form.service';

@Injectable()
export class EligibilityService {
  constructor(
    private readonly formService: FormService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  async findCompletedForms(phoneNumber: string): Promise<string[]> {
    const formNames = await this.formService.findFormNames({});
    const completedForms: string[] = [];
    const userId = await this.formService.findUserIdByPhoneNumber(phoneNumber);
    const appliedFormIds = userId
      ? await this.applicationsService.findFormIdsByApplicantId(userId)
      : [];
    const appliedSet = new Set(appliedFormIds);

    for (const formName of formNames) {
      if (appliedSet.has(formName)) {
        continue;
      }

      const missing = await this.formService.findFormRequirements({
        form_name: formName,
        phone_number: phoneNumber,
      });

      if (missing && missing.length === 0) {
        completedForms.push(formName);
      }
    }

    return completedForms;
  }

  async findEligibilityInfo(
    phoneNumber: string,
    formName?: string,
  ): Promise<Record<string, unknown>[]> {
    const forms = await this.formService.findForms({
      fields: 'form_name,policy',
      formName,
    });
    const criteria: {
      field_id: string;
      criteria: { op: string; values?: string[] };
    }[] = [];

    for (const form of forms) {
      const policy = this.parsePolicy(form.policy);
      if (!policy || typeof policy !== 'object') {
        continue;
      }

      const requiredFields = (policy as { required_fields?: unknown })
        .required_fields;
      if (Array.isArray(requiredFields)) {
        for (const entry of requiredFields) {
          if (!entry || typeof entry !== 'object') {
            continue;
          }
          const criteriaNode = (entry as { criteria?: unknown }).criteria;
          const op =
            criteriaNode && typeof criteriaNode === 'object'
              ? (criteriaNode as { op?: unknown }).op
              : undefined;
          if (typeof op !== 'string' || op.length === 0) {
            continue;
          }
          const fieldIdFromCriteria =
            criteriaNode && typeof criteriaNode === 'object'
              ? (criteriaNode as { field_id?: unknown }).field_id
              : undefined;
          const fieldIdFromEntry = (entry as { field_id?: unknown }).field_id;
          const fieldId =
            typeof fieldIdFromCriteria === 'string'
              ? fieldIdFromCriteria
              : typeof fieldIdFromEntry === 'string'
                ? fieldIdFromEntry
                : undefined;
          if (typeof fieldId === 'string' && fieldId.length > 0) {
            const values =
              criteriaNode && typeof criteriaNode === 'object'
                ? (criteriaNode as { values?: unknown }).values
                : undefined;
            criteria.push({
              field_id: fieldId,
              criteria: {
                op,
                values: Array.isArray(values)
                  ? values.map((item) => String(item))
                  : undefined,
              },
            });
          }
        }
      }

      const eligibilityRules = (policy as { eligibility_rules?: unknown })
        .eligibility_rules;
      if (Array.isArray(eligibilityRules)) {
        for (const entry of eligibilityRules) {
          if (!entry || typeof entry !== 'object') {
            continue;
          }
          const rule =
            (entry as { rule?: unknown; criteria?: unknown }).rule ??
            (entry as { criteria?: unknown }).criteria;
          if (!rule || typeof rule !== 'object') {
            continue;
          }
          const op = (rule as { op?: unknown }).op;
          const fieldId = (rule as { field_id?: unknown }).field_id;
          const values = (rule as { values?: unknown }).values;
          if (
            typeof op === 'string' &&
            op.length > 0 &&
            typeof fieldId === 'string' &&
            fieldId.length > 0
          ) {
            criteria.push({
              field_id: fieldId,
              criteria: {
                op,
                values: Array.isArray(values)
                  ? values.map((item) => String(item))
                  : undefined,
              },
            });
          }
        }
      }
    }

    const userId = await this.formService.findUserIdByPhoneNumber(phoneNumber);
    if (!userId) {
      return [];
    }

    const facts = await this.formService.findApplicantFactsByUserId(userId);
    const factMap = new Map<string, string[] | null>();
    for (const fact of facts) {
      if (!factMap.has(fact.field_id)) {
        factMap.set(fact.field_id, fact.value);
      }
    }

    return criteria.map((entry) => {
      const value = factMap.get(entry.field_id) ?? null;
      return {
        field_id: entry.field_id,
        value,
        criteria: entry.criteria,
        valid: this.evaluateCriterion(entry.criteria, value),
      };
    });
  }

  async findFormStatus(
    phoneNumber: string,
    formName?: string,
  ): Promise<
    { form_name: string; is_complete: boolean; is_eligible: boolean }[]
  > {
    const normalizedFormName =
      typeof formName === 'string' ? formName.trim() : '';
    const formNames =
      normalizedFormName.length > 0
        ? [normalizedFormName]
        : await this.formService.findFormNames({});
    const userId = await this.formService.findUserIdByPhoneNumber(phoneNumber);
    const appliedFormIds = userId
      ? await this.applicationsService.findFormIdsByApplicantId(userId)
      : [];
    const appliedSet = new Set(appliedFormIds);

    const statuses: {
      form_name: string;
      is_complete: boolean;
      is_eligible: boolean;
    }[] = [];

    for (const formName of formNames) {
      let isComplete = false;
      if (!appliedSet.has(formName)) {
        const missing = await this.formService.findFormRequirements({
          form_name: formName,
          phone_number: phoneNumber,
        });
        if (missing && missing.length === 0) {
          isComplete = true;
        }
      }

      const eligibilityInfo = await this.findEligibilityInfo(
        phoneNumber,
        formName,
      );
      const isEligible =
        eligibilityInfo.length > 0 &&
        eligibilityInfo.every(
          (entry) => (entry as { valid?: unknown }).valid === true,
        );

      statuses.push({
        form_name: formName,
        is_complete: isComplete,
        is_eligible: isEligible,
      });
    }

    return statuses;
  }

  private parsePolicy(policy: unknown): unknown | null {
    if (!policy) {
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

  private evaluateCriterion(
    criteria: { op: string; values?: string[] },
    value: string[] | null,
  ): boolean {
    switch (criteria.op) {
      case 'exists': {
        return Array.isArray(value)
          ? value.some((item) => item.trim().length > 0)
          : false;
      }
      case 'valid_email': {
        if (!Array.isArray(value)) {
          return false;
        }
        const emailRegex =
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return value.some((item) => emailRegex.test(item.trim()));
      }
      case 'valid_phone': {
        if (!Array.isArray(value)) {
          return false;
        }
        return value.some((item) => {
          const digits = item.replace(/\D/g, '');
          return digits.length >= 7 && digits.length <= 15;
        });
      }
      case 'in': {
        if (
          !Array.isArray(value) ||
          !criteria.values ||
          criteria.values.length === 0
        ) {
          return false;
        }
        const allowed = new Set(criteria.values);
        return value.some((item) => allowed.has(item));
      }
      default:
        return false;
    }
  }
}
