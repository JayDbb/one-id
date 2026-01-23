import { Injectable } from '@nestjs/common';
import { ApplicationsService } from '../applications/applications.service';
import { FormService } from '../form/form.service';

@Injectable()
export class EligibilityService {
  constructor(
    private readonly formService: FormService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  async findCompletedForms(phoneNumber: string): Promise<string[]> {
    const formNames = await this.formService.findFormNames({});
    const completedForms: string[] = [];
    const userId = await this.formService.findUserIdByPhoneNumber(phoneNumber);
    const appliedFormIds = userId
      ? await this.applicationsService.findFormIdsByApplicantId(userId)
      : [];
    const appliedSet = new Set(appliedFormIds);

    for (const formName of formNames) {
      if (appliedSet.has(formName)) {
        continue;
      }

      const missing = await this.formService.findFormRequirements({
        form_name: formName,
        phone_number: phoneNumber,
      });

      if (missing && missing.length === 0) {
        completedForms.push(formName);
      }
    }

    return completedForms;
  }
}
