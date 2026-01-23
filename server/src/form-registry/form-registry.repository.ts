import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FormRegistryRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(fields?: string[]): Promise<Record<string, unknown>[]> {
    const selectFields = fields && fields.length > 0
      ? fields.join(',')
      : 'field_id,title,prompt_template,type,validation,normalizers,aliases,category';

    const { data, error } = await this.supabaseService
      .getClient()
      .from('field_registry')
      .select(selectFields);

    if (error) {
      throw new Error(`Failed to fetch field registry: ${error.message}`);
    }

    return (data ?? []) as unknown as Record<string, unknown>[];
  }
}
