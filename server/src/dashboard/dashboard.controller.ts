import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats() {
    return this.dashboardService.getDashboardStats();
  }

  @Get('analytics')
  async getAnalytics() {
    return this.dashboardService.getApplicationAnalytics();
  }

  @Get('recent-applications')
  async getRecentApplications() {
    return this.dashboardService.getRecentApplications();
  }

  @Get('application-status')
  async getApplicationStatus() {
    return this.dashboardService.getApplicationStatus();
  }

  @Get('active-forms')
  async getActiveForms() {
    return this.dashboardService.getActiveForms();
  }
}
