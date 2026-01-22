import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getDashboardStats() {
    const [
      totalApplications,
      activeForms,
      totalApplicants,
      pendingApplications,
    ] = await Promise.all([
      this.dashboardRepository.countTotalApplications(),
      this.dashboardRepository.countActiveForms(),
      this.dashboardRepository.countTotalApplicants(),
      this.dashboardRepository.countPendingApplications(),
    ]);

    return {
      totalApplications,
      activeForms,
      totalApplicants,
      pendingApplications,
    };
  }

  async getApplicationAnalytics() {
    const last7Days = await this.dashboardRepository.getApplicationsLast7Days();
    return {
      data: last7Days.map((day) => day.count),
      labels: last7Days.map((day) => day.date),
      total: last7Days.reduce((sum, day) => sum + day.count, 0),
    };
  }

  async getRecentApplications() {
    const [applications, allForms] = await Promise.all([
      this.dashboardRepository.getRecentApplications(5),
      this.dashboardRepository.getAllForms(),
    ]);
    
    // Get form names for each application
    const applicationsWithForms = await Promise.all(
      applications.map(async (app) => {
        const form = allForms.find((f) => f.form_name === app.form_id);
        
        // Count unique applicants for this form (group by form_id)
        const applicantCount = await this.dashboardRepository.countApplicationsByFormId(
          app.form_id,
        );

        return {
          formId: app.form_id,
          formName: form?.shorten_name || form?.form_name || app.form_id,
          applicants: applicantCount,
          status: this.mapStatus(app.status),
          createdAt: new Date(app.created_at).toISOString().split('T')[0],
        };
      }),
    );

    return applicationsWithForms;
  }

  async getApplicationStatus() {
    const counts = await this.dashboardRepository.getApplicationStatusCounts();
    
    const total = counts.approved + counts.pending + counts.declined + counts.submitted;
    
    return {
      total,
      approved: counts.approved,
      pending: counts.pending,
      declined: counts.declined,
      submitted: counts.submitted,
      inProgress: counts.pending + counts.submitted, // pending + submitted = in progress
    };
  }

  async getActiveForms() {
    const forms = await this.dashboardRepository.getActiveForms();
    
    const formsWithCounts = await Promise.all(
      forms.map(async (form) => {
        const applicantCount = await this.dashboardRepository.countApplicationsByFormId(
          form.form_name,
        );

        return {
          formName: form.shorten_name || form.form_name,
          formId: form.form_name,
          version: 1, // Version not in schema, defaulting to 1
          isActive: form.is_active,
          applicants: applicantCount,
        };
      }),
    );

    return formsWithCounts;
  }

  private mapStatus(status: string): string {
    const statusMap: Record<string, string> = {
      draft: 'draft',
      submitted: 'submitted',
      pending: 'pending',
      approved: 'approved',
      rejected: 'rejected',
      declined: 'declined',
    };

    return statusMap[status?.toLowerCase()] || status;
  }
}
