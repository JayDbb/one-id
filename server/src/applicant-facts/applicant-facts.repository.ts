import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ApplicantFact } from './entities/applicant-fact.entity';

export interface CreateApplicantFactData {
  field_id: string;
  value: string[];
  status: string;
  source: string;
  is_current: boolean;
  user_id: string;
}

@Injectable()
export class ApplicantFactsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findOneByFieldAndValue(
    fieldId: string,
    value: string,
  ): Promise<ApplicantFact | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applicant_facts')
      .select('*')
      .eq('field_id', fieldId)
      .contains('value', [value])
      .limit(1)
      .single();

    if (error) {
      // PGRST116 means no rows found, which is not an error for us
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch applicant fact: ${error.message}`);
    }

    return data as ApplicantFact;
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
      // PGRST116 means no rows found
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch user_id: ${error.message}`);
    }

    return data?.user_id ?? null;
  }

  async create(data: CreateApplicantFactData): Promise<ApplicantFact> {
    const { data: createdData, error } = await this.supabaseService
      .getClient()
      .from('applicant_facts')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create applicant fact: ${error.message}`);
    }

    return createdData as ApplicantFact;
  }

  async updateByUserIdAndFieldId(
    userId: string,
    fieldId: string,
    value: string[],
  ): Promise<ApplicantFact | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applicant_facts')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('field_id', fieldId)
      .select()
      .single();

    if (error) {
      // PGRST116 means no rows found
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to update applicant fact: ${error.message}`);
    }

    return data as ApplicantFact;
  }
}
