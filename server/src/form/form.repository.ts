import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
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
}
