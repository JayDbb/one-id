import { Injectable } from '@nestjs/common';
import { ApplicationsRepository } from './applications.repository';
import { GetApplicationsDto } from './dto/get-applications.dto';
import { Application, ApplicationDetail } from './entities/application.entity';
import { ApplicantFact } from '../applicant-facts/entities/applicant-fact.entity';

@Injectable()
export class ApplicationsService {
  private readonly FIELD_IDS = {
    FULL_NAME: 'applicant.full_name',
    NATIONAL_ID: 'applicant.national_id_number',
    DIVISION: 'applicant.address.division',
    TRN: 'applicant.tax_registration_number',
  };

  constructor(
    private readonly applicationsRepository: ApplicationsRepository,
  ) {}

  async findFormIdsByApplicantId(applicantId: string): Promise<string[]> {
    return this.applicationsRepository.findFormIdsByApplicantId(applicantId);
  }

  async findAll(query: GetApplicationsDto): Promise<{
    data: Application[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      status,
      division,
      form_id,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = query;

    // Get all applications with filters
    const applications = await this.applicationsRepository.findAll({
      status,
      form_id,
      dateFrom,
      dateTo,
    });

    // Build application list with applicant details
    const applicationList: Application[] = [];

    for (const app of applications) {
      // Get applicant facts
      const facts = await this.applicationsRepository.findFactsByApplicantId(
        app.applicant,
      );

      if (facts.length === 0) continue;

      // Extract applicant details - group by field_id
      const factMap = new Map<string, string>();
      facts.forEach((fact) => {
        // Handle value as array or string
        let value: string | undefined;
        if (Array.isArray(fact.value)) {
          value = fact.value.length > 0 ? fact.value[0] : undefined;
        } else if (fact.value) {
          value = String(fact.value);
        }
        
        if (value) {
          factMap.set(fact.field_id, value);
        }
      });

      const applicantDivision = factMap.get(this.FIELD_IDS.DIVISION) || '';

      // Apply division filter
      if (division && applicantDivision !== division) {
        continue;
      }

      // Get form name (use shorten_name for tables)
      const form = await this.applicationsRepository.findFormByName(
        app.form_id,
      );
      const formName = form?.shorten_name || form?.form_name || app.form_id;

      applicationList.push({
        id: app.id,
        applicantName: factMap.get(this.FIELD_IDS.FULL_NAME) || 'N/A',
        citizenId: factMap.get(this.FIELD_IDS.TRN) || 'N/A',
        applicationName: formName,
        dateApplied: new Date(app.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        division: applicantDivision,
        status: this.mapStatus(app.status),
      });
    }

    // Calculate pagination
    const total = applicationList.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApplications = applicationList.slice(startIndex, endIndex);

    return {
      data: paginatedApplications,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<ApplicationDetail> {
    const applicationId = parseInt(id, 10);
    if (isNaN(applicationId)) {
      throw new Error('Invalid application ID');
    }

    const app = await this.applicationsRepository.findOne(applicationId);
    if (!app) {
      throw new Error('Application not found');
    }

    // Get applicant facts
    const facts = await this.applicationsRepository.findFactsByApplicantId(
      app.applicant,
    );

    // Extract applicant details
    const factMap = new Map<string, string>();
    const applicantFacts: Record<string, any> = {};
    facts.forEach((fact) => {
      if (fact.value && fact.value.length > 0) {
        factMap.set(fact.field_id, fact.value[0]);
        applicantFacts[fact.field_id] = fact.value;
      }
    });

    // Get form details
    const form = await this.applicationsRepository.findFormByName(app.form_id);

    return {
      id: app.id,
      applicantId: app.applicant,
      applicantName: factMap.get(this.FIELD_IDS.FULL_NAME) || 'N/A',
      citizenId: factMap.get(this.FIELD_IDS.NATIONAL_ID) || 'N/A',
      applicationName: form?.shorten_name || form?.form_name || app.form_id,
      formId: app.form_id,
      dateApplied: new Date(app.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      division: factMap.get(this.FIELD_IDS.DIVISION) || 'N/A',
      status: this.mapStatus(app.status),
      createdAt: app.created_at,
      applicantFacts,
      formPolicy: form?.policy,
    };
  }

  async create(
    formId: string,
    applicantId: string | number,
    status?: string,
  ): Promise<any> {
    // Verify form exists
    const form = await this.applicationsRepository.findFormByName(formId);
    if (!form) {
      throw new Error(`Form not found: ${formId}`);
    }

    // Convert applicantId to number if it's a string UUID
    let applicantIdValue: string | number = applicantId;
    if (typeof applicantId === 'string') {
      // Check if it's a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(applicantId);
      if (!isUUID) {
        // Try to parse as number
        const numericId = parseInt(applicantId, 10);
        if (!isNaN(numericId)) {
          applicantIdValue = numericId;
        }
      }
    }

    // Create the application
    const application = await this.applicationsRepository.create({
      applicant: applicantIdValue,
      form_id: formId,
      status: status || 'submitted',
    });

    return application;
  }

  private mapStatus(status: string): string {
    // Map database status to UI status
    const statusMap: Record<string, string> = {
      draft: 'draft',
      submitted: 'applied',
      pending: 'under-review',
      approved: 'approved',
      rejected: 'declined',
      declined: 'declined',
    };

    return statusMap[status.toLowerCase()] || status;
  }
}
