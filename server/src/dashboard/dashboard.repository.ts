import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class DashboardRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async countTotalApplications(): Promise<number> {
    const { count, error } = await this.supabaseService
      .getClient()
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'draft');

    if (error) {
      throw new Error(`Failed to count applications: ${error.message}`);
    }

    return count || 0;
  }

  async countActiveForms(): Promise<number> {
    const { count, error } = await this.supabaseService
      .getClient()
      .from('form_criteria')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (error) {
      throw new Error(`Failed to count active forms: ${error.message}`);
    }

    return count || 0;
  }

  async countTotalApplicants(): Promise<number> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applicant_facts')
      .select('user_id')
      .eq('is_current', true);

    if (error) {
      throw new Error(`Failed to count applicants: ${error.message}`);
    }

    const uniqueIds = new Set(data.map((item) => item.user_id));
    return uniqueIds.size;
  }

  async countPendingApplications(): Promise<number> {
    const { count, error } = await this.supabaseService
      .getClient()
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) {
      throw new Error(`Failed to count pending applications: ${error.message}`);
    }

    return count || 0;
  }

  async getApplicationsLast7Days(): Promise<{ date: string; count: number }[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data, error } = await this.supabaseService
      .getClient()
      .from('applications')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString())
      .neq('status', 'draft');

    if (error) {
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }

    // Group by date
    const dateMap = new Map<string, number>();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result: { date: string; count: number }[] = [];

    // Initialize all 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dayName = days[date.getDay()];
      result.push({ date: dayName, count: 0 });
    }

    // Count applications per day
    data?.forEach((app) => {
      const appDate = new Date(app.created_at);
      appDate.setHours(0, 0, 0, 0);
      const dayName = days[appDate.getDay()];
      const existing = result.find((r) => r.date === dayName);
      if (existing) {
        existing.count++;
      }
    });

    return result;
  }

  async getRecentApplications(limit: number = 5): Promise<any[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applications')
      .select('*')
      .neq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch recent applications: ${error.message}`);
    }

    return data || [];
  }

  async getApplicationStatusCounts(): Promise<{
    approved: number;
    pending: number;
    declined: number;
    submitted: number;
  }> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('applications')
      .select('status')
      .neq('status', 'draft');

    if (error) {
      throw new Error(`Failed to fetch application statuses: ${error.message}`);
    }

    const counts = {
      approved: 0,
      pending: 0,
      declined: 0,
      submitted: 0,
    };

    data?.forEach((app) => {
      const status = app.status?.toLowerCase();
      if (status === 'approved') {
        counts.approved++;
      } else if (status === 'pending') {
        counts.pending++;
      } else if (status === 'declined' || status === 'rejected') {
        counts.declined++;
      } else if (status === 'submitted') {
        counts.submitted++;
      }
    });

    return counts;
  }

  async getActiveForms(): Promise<any[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('form_criteria')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch active forms: ${error.message}`);
    }

    return data || [];
  }

  async getAllForms(): Promise<any[]> {
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
