import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FormsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<any[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('form_criteria')
      .select('*');

    if (error) {
      throw new Error(`Failed to fetch forms: ${error.message}`);
    }

    return data || [];
  }

  async countApplicationsByFormId(formName: string): Promise<number> {
    const { count, error } = await this.supabaseService
      .getClient()
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('form_id', formName)
      .neq('status', 'draft');

    if (error) {
      throw new Error(`Failed to count applications: ${error.message}`);
    }

    return count || 0;
  }
}
