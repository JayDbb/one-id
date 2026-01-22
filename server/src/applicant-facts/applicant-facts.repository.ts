import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ApplicantFact } from './entities/applicant-fact.entity';

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
}
