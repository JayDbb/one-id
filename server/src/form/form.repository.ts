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
}
