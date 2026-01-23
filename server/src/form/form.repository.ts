import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { FieldRegistryRow } from './entities/field-registry.entity';
import { FormNameRow } from './entities/form-name.entity';

@Injectable()
export class FormRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findFormNames(formName?: string): Promise<string[]> {
    let query = this.supabaseService
      .getClient()
      .from('form_criteria')
      .select('form_name');

    if (formName) {
      query = query.eq('form_name', formName);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch form names: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return (data as FormNameRow[])
      .map((row) => row.form_name)
      .filter((name): name is string => typeof name === 'string' && name.length > 0);
  }

  async findForms(
    formName?: string,
    fields?: string[],
  ): Promise<Record<string, unknown>[]> {
    const selectFields = fields && fields.length > 0
      ? fields.join(',')
      : 'form_name,policy,shorten_name';

    let query = this.supabaseService
      .getClient()
      .from('form_criteria')
      .select(selectFields);

    if (formName) {
      query = query.eq('form_name', formName);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch forms: ${error.message}`);
    }

    return (data ?? []) as unknown as Record<string, unknown>[];
  }

  async findFormPolicy(formName: string): Promise<unknown | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('form_criteria')
      .select('policy')
      .eq('form_name', formName)
      .limit(1)
      .single();

    if (error) {
      // PGRST116 means no rows found, which is not an error for us
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch form policy: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return (data as { policy?: unknown }).policy ?? null;
  }

  async findUserIdByPhoneNumber(phoneNumber: string): Promise<string | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applicant_facts')
      .select('user_id')
      .eq('field_id', 'applicant.phone_number')
      .contains('value', [phoneNumber])
      .limit(1)
      .single();

    if (error) {
      // PGRST116 means no rows found, which is not an error for us
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch applicant user id: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const userId = (data as { user_id?: unknown }).user_id;
    return typeof userId === 'string' && userId.length > 0 ? userId : null;
  }

  async findApplicantFieldIdsByUserId(userId: string): Promise<string[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applicant_facts')
      .select('field_id')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to fetch applicant field ids: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    const fieldIds = (data as { field_id?: unknown }[])
      .map((row) => row.field_id)
      .filter(
        (fieldId): fieldId is string =>
          typeof fieldId === 'string' && fieldId.length > 0,
      );

    return Array.from(new Set(fieldIds));
  }

  async findApplicantFactsByUserId(
    userId: string,
  ): Promise<{ field_id: string; value: string[] | null }[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applicant_facts')
      .select('field_id,value')
      .eq('user_id', userId)
      .eq('is_current', true);

    if (error) {
      throw new Error(`Failed to fetch applicant facts: ${error.message}`);
    }

    return (data ?? [])
      .map((row) => {
        const fieldId = (row as { field_id?: unknown }).field_id;
        const value = (row as { value?: unknown }).value;
        return {
          field_id: typeof fieldId === 'string' ? fieldId : '',
          value: Array.isArray(value)
            ? value.map((item) => String(item))
            : null,
        };
      })
      .filter((row) => row.field_id.length > 0);
  }

  async findFieldRegistryRowsByIds(
    fieldIds: string[],
  ): Promise<FieldRegistryRow[]> {
    if (fieldIds.length === 0) {
      return [];
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .from('field_registry')
      .select('field_id,title,prompt_template,type,validation,normalizers,aliases')
      .in('field_id', fieldIds);

    if (error) {
      throw new Error(`Failed to fetch field registry rows: ${error.message}`);
    }

    return (data ?? []) as FieldRegistryRow[];
  }

  async findAllFieldRegistryFieldIds(): Promise<string[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('field_registry')
      .select('field_id');

    if (error) {
      throw new Error(`Failed to fetch field registry ids: ${error.message}`);
    }

    const fieldIds = (data ?? [])
      .map((row) => (row as { field_id?: unknown }).field_id)
      .filter(
        (fieldId): fieldId is string =>
          typeof fieldId === 'string' && fieldId.length > 0,
      );

    return Array.from(new Set(fieldIds));
  }
}
