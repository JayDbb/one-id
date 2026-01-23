import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ApplicantFact } from '../applicant-facts/entities/applicant-fact.entity';

@Injectable()
export class ApplicationsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(filters: {
    status?: string;
    form_id?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<any[]> {
    let query = this.supabaseService
      .getClient()
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.form_id) {
      query = query.eq('form_id', filters.form_id);
    }

    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }

    return data || [];
  }

  async findOne(id: number): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch application: ${error.message}`);
    }

    return data;
  }

  async findFactsByApplicantId(applicantId: number | string): Promise<ApplicantFact[]> {
    // Convert to string since user_id is stored as text in the database
    const userIdString = String(applicantId);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applicant_facts')
      .select('*')
      .eq('user_id', userIdString)
      .eq('is_current', true);

    if (error) {
      throw new Error(
        `Failed to fetch applicant facts: ${error.message}`,
      );
    }

    return data as ApplicantFact[];
  }

  async findFormByName(formName: string): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('form_criteria')
      .select('*')
      .eq('form_name', formName)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch form: ${error.message}`);
    }

    return data;
  }

  async findFormIdsByApplicantId(applicantId: string): Promise<string[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applications')
      .select('form_id')
      .eq('applicant', applicantId);

    if (error) {
      throw new Error(`Failed to fetch applicant form ids: ${error.message}`);
    }

    const formIds = (data ?? [])
      .map((row) => (row as { form_id?: unknown }).form_id)
      .filter(
        (formId): formId is string =>
          typeof formId === 'string' && formId.length > 0,
      );

    return Array.from(new Set(formIds));
  }

  async create(applicationData: {
    applicant: string | number;
    form_id: string;
    status?: string;
  }): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applications')
      .insert({
        applicant: applicationData.applicant,
        form_id: applicationData.form_id,
        status: applicationData.status || 'submitted',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create application: ${error.message}`);
    }

    return data;
  }
}
