import { Injectable } from '@nestjs/common';
import { FormsRepository } from './forms.repository';
import { Form } from './entities/form.entity';

@Injectable()
export class FormsService {
  constructor(private readonly formsRepository: FormsRepository) {}

  async findAll(): Promise<Form[]> {
    const forms = await this.formsRepository.findAll();
    const formList: Form[] = [];

    // Filter out forms with shorten_name of "Registration" (case-insensitive, trimmed)
    const filteredForms = forms.filter((form) => {
      const shortenName = form.shorten_name?.trim().toLowerCase();
      return shortenName !== 'registration';
    });

    for (const form of filteredForms) {
      // Calculate field requirements count from policy
      const fieldRequirementsCount = form.policy?.required_fields?.length || 0;

      // Count current applications (excluding drafts)
      const currentApplicationsCount =
        await this.formsRepository.countApplicationsByFormId(form.form_name);

      // Determine status
      let status: 'active' | 'upcoming' | 'closed' = 'closed';
      if (form.is_active) {
        status = 'active';
      }

      // Check if CDF (form name contains CDF or cdf)
      const isCDF =
        form.form_name.toLowerCase().includes('cdf') ||
        form.form_name.toLowerCase().includes('needs assessment');

      formList.push({
        id: form.form_name,
        name: form.form_name,
        shortName: form.shorten_name || form.form_name,
        status,
        fieldRequirements: fieldRequirementsCount,
        currentApplications: currentApplicationsCount,
        isCDF,
      });
    }

    return formList;
  }
}
