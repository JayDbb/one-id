import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    // Try to get from ConfigService first, then fallback to process.env
    const supabaseUrl = 
      this.configService.get<string>('SUPABASE_URL') || 
      process.env.SUPABASE_URL;
    const supabaseKey = 
      this.configService.get<string>('SUPABASE_ANON_KEY') || 
      process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables. ' +
        'Please set these in your Vercel project settings or .env file.',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
