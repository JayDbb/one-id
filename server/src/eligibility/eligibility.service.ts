import { Injectable } from '@nestjs/common';
import { FormService } from '../form/form.service';

@Injectable()
export class EligibilityService {
  constructor(private readonly formService: FormService) {}

  async findCompletedForms(phoneNumber: string): Promise<string[]> {
    const formNames = await this.formService.findFormNames({});
    const completedForms: string[] = [];

    for (const formName of formNames) {
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
