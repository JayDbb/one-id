import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ApplicantFact } from '../applicant-facts/entities/applicant-fact.entity';

@Injectable()
export class PeopleRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAllApplicantIds(): Promise<(number | string)[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applicant_facts')
      .select('user_id')
      .eq('is_current', true);

    if (error) {
      throw new Error(`Failed to fetch applicant IDs: ${error.message}`);
    }

    // Get unique IDs (can be numbers or UUIDs)
    const uniqueIds = [...new Set(data.map((item) => item.user_id))];
    return uniqueIds;
  }

  async findFactsByApplicantId(applicantId: number | string): Promise<ApplicantFact[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applicant_facts')
      .select('*')
      .eq('user_id', applicantId)
      .eq('is_current', true);

    if (error) {
      throw new Error(
        `Failed to fetch applicant facts: ${error.message}`,
      );
    }

    return data as ApplicantFact[];
  }

  async findApplicationsByApplicantId(applicantId: number | string): Promise<any[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applications')
      .select('*')
      .eq('applicant', applicantId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }

    return data || [];
  }

  async countApplicationsByApplicantId(applicantId: number | string): Promise<number> {
    const { count, error } = await this.supabaseService
      .getClient()
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('applicant', applicantId);

    if (error) {
      throw new Error(`Failed to count applications: ${error.message}`);
    }

    return count || 0;
  }

  async findAllForms(): Promise<any[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('form_criteria')
      .select('*')
      .eq('is_active', true);

    if (error) {
      throw new Error(`Failed to fetch forms: ${error.message}`);
    }

    // Filter out forms with shorten_name of "Registration" (case-insensitive, trimmed)
    const filtered = (data || []).filter((form) => {
      const shortenName = form.shorten_name?.trim().toLowerCase();
      return shortenName !== 'registration';
    });

    return filtered;
  }

  async findUserIdByTRN(trn: string): Promise<number | string | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applicant_facts')
      .select('user_id')
      .eq('field_id', 'applicant.tax_registration_number')
      .eq('is_current', true)
      .contains('value', [trn])
      .limit(1);

    if (error) {
      throw new Error(`Failed to find user by TRN: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data[0]?.user_id || null;
  }
}
