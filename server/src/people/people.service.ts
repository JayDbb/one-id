import { Injectable } from '@nestjs/common';
import { PeopleRepository } from './people.repository';
import { GetPeopleDto } from './dto/get-people.dto';
import { Person, PersonDetail } from './entities/person.entity';
import { ApplicantFact } from '../applicant-facts/entities/applicant-fact.entity';

@Injectable()
export class PeopleService {
  private readonly FIELD_IDS = {
    FULL_NAME: 'applicant.full_name',
    DATE_OF_BIRTH: 'applicant.date_of_birth',
    DIVISION: 'applicant.address.division',
    GENDER: 'applicant.sex',
    NATIONALITY: 'applicant.nationality',
    NATIONAL_ID: 'applicant.national_id_number',
    MARITAL_STATUS: 'applicant.marital_status',
    OCCUPATION: 'applicant.occupation',
    ADDRESS_LINE1: 'applicant.address.line1',
    ADDRESS_LINE2: 'applicant.address.line2',
    PHONE: 'applicant.phone_number',
    PHONE_HOME: 'applicant.phone_number_home',
    EMAIL: 'applicant.email',
    TRN: 'applicant.tax_registration_number',
  };

  constructor(private readonly peopleRepository: PeopleRepository) {}

  async findAll(query: GetPeopleDto): Promise<{
    data: Person[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { search, division, page = 1, limit = 20 } = query;

    // Get all unique applicant IDs
    const applicantIds = await this.peopleRepository.findAllApplicantIds();
    
    // Ensure IDs are unique (additional safety check)
    const uniqueApplicantIds = [...new Set(applicantIds)];

    // Build person list
    const people: Person[] = [];
    const seenIds = new Set<string>();

    for (const applicantId of uniqueApplicantIds) {
      // Skip if we've already processed this ID
      const idKey = String(applicantId);
      if (seenIds.has(idKey)) {
        continue;
      }
      seenIds.add(idKey);
      const facts = await this.peopleRepository.findFactsByApplicantId(
        applicantId,
      );

      console.log(facts);

      if (facts.length === 0) continue;

      const person = this.buildPersonFromFacts(applicantId, facts);

      // Apply filters
      if (search) {
        const searchLower = search.toLowerCase();
        if (
          !person.fullName.toLowerCase().includes(searchLower) &&
          !applicantId.toString().includes(searchLower)
        ) {
          continue;
        }
      }

      if (division && person.division !== division) {
        continue;
      }

      // Count forms applied
      person.formsApplied =
        await this.peopleRepository.countApplicationsByApplicantId(applicantId);

      // Count forms qualified
      person.formsQualified = await this.countQualifiedForms(applicantId, facts);

      people.push(person);
    }

    // Calculate pagination
    const total = people.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPeople = people.slice(startIndex, endIndex);

    return {
      data: paginatedPeople,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<PersonDetail> {
    let applicantId: number | string;

    // Check if it's a UUID format (contains dashes)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    if (isUUID) {
      // It's a UUID, use it directly as user_id
      applicantId = id;
    } else {
      // Try to parse as number first (user_id)
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        applicantId = numericId;
      } else {
        // If not a number or UUID, try to find by TRN
        const userIdByTRN = await this.peopleRepository.findUserIdByTRN(id);
        if (!userIdByTRN) {
          throw new Error(`Person not found with ID or TRN: ${id}`);
        }
        applicantId = userIdByTRN;
      }
    }

    // Get all facts for this user_id (id field groups all facts for a user)
    const facts = await this.peopleRepository.findFactsByApplicantId(applicantId);
    if (facts.length === 0) {
      throw new Error(`Person not found with ID: ${applicantId}`);
    }

    // Debug: log the facts we retrieved
    console.log(`Found ${facts.length} facts for applicant ID ${applicantId}`);
    console.log('Sample facts:', facts.slice(0, 3).map(f => ({ field_id: f.field_id, value: f.value })));

    const person = this.buildPersonDetailFromFacts(applicantId, facts);

    // Get applications
    const applications = await this.peopleRepository.findApplicationsByApplicantId(
      applicantId,
    );

    person.applications = await Promise.all(
      applications.map(async (app) => {
        // Get form name from form_criteria
        const forms = await this.peopleRepository.findAllForms();
        const form = forms.find((f) => f.form_name === app.form_id);

        return {
          id: app.id,
          formName: form?.form_name || app.form_id,
          status: app.status,
          submittedDate: new Date(app.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          decisionDate: app.status === 'draft' ? null : app.created_at,
        };
      }),
    );

    // Get qualifications
    person.qualifications = await this.getQualifications(applicantId, facts);

    return person;
  }

  private buildPersonFromFacts(
    applicantId: number | string,
    facts: ApplicantFact[],
  ): Person {
    const factMap = new Map<string, string>();
    // Group all facts by field_id - each fact row has field_id and value
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

    // Get phone number - prefer mobile, fallback to home
    const phoneNumber = factMap.get(this.FIELD_IDS.PHONE) || 
                       factMap.get(this.FIELD_IDS.PHONE_HOME) || 
                       undefined;

    return {
      id: applicantId,
      trn: factMap.get(this.FIELD_IDS.TRN) || undefined,
      fullName: factMap.get(this.FIELD_IDS.FULL_NAME) || 'N/A',
      phoneNumber,
      division: factMap.get(this.FIELD_IDS.DIVISION) || 'N/A',
      formsApplied: 0, // Will be calculated
      formsQualified: 0, // Will be calculated
    };
  }

  private buildPersonDetailFromFacts(
    applicantId: number | string,
    facts: ApplicantFact[],
  ): PersonDetail {
    const factMap = new Map<string, string>();
    // Group all facts by field_id - each fact row has field_id and value
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

    const dateOfBirth = factMap.get(this.FIELD_IDS.DATE_OF_BIRTH);
    let age: number | undefined;
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
    }

    // Get phone number - prefer mobile, fallback to home
    const phoneNumber = factMap.get(this.FIELD_IDS.PHONE) || 
                       factMap.get(this.FIELD_IDS.PHONE_HOME) || 
                       undefined;

    // Get TRN
    const trn = factMap.get(this.FIELD_IDS.TRN) || undefined;
    
    // Debug: log TRN extraction
    console.log('TRN extraction:', {
      fieldId: this.FIELD_IDS.TRN,
      trnValue: trn,
      factMapKeys: Array.from(factMap.keys()),
      hasTRN: factMap.has(this.FIELD_IDS.TRN),
    });

    return {
      id: applicantId,
      fullName: factMap.get(this.FIELD_IDS.FULL_NAME) || 'N/A',
      phoneNumber,
      trn,
      dateOfBirth: dateOfBirth || 'N/A',
      age,
      gender: factMap.get(this.FIELD_IDS.GENDER) || 'N/A',
      nationality: factMap.get(this.FIELD_IDS.NATIONALITY) || 'N/A',
      nationalId: factMap.get(this.FIELD_IDS.NATIONAL_ID) || 'N/A',
      maritalStatus: factMap.get(this.FIELD_IDS.MARITAL_STATUS) || 'N/A',
      occupation: factMap.get(this.FIELD_IDS.OCCUPATION) || 'N/A',
      division: factMap.get(this.FIELD_IDS.DIVISION) || 'N/A',
      location: factMap.get(this.FIELD_IDS.DIVISION) || 'N/A',
      residentialAddress: {
        line1: factMap.get(this.FIELD_IDS.ADDRESS_LINE1) || 'N/A',
        line2: factMap.get(this.FIELD_IDS.ADDRESS_LINE2) || 'N/A',
      },
      primaryPhone: phoneNumber || 'N/A',
      emailAddress: factMap.get(this.FIELD_IDS.EMAIL) || 'N/A',
      formsApplied: 0,
      formsQualified: 0,
      applications: [],
      qualifications: [],
    };
  }

  private async countQualifiedForms(
    applicantId: number | string,
    facts: ApplicantFact[],
  ): Promise<number> {
    const forms = await this.peopleRepository.findAllForms();
    let qualifiedCount = 0;

    for (const form of forms) {
      if (!form.policy?.required_fields) continue;

      const requiredFields = form.policy.required_fields;
      const factMap = new Map<string, string>();
      facts.forEach((fact) => {
        if (fact.value && fact.value.length > 0) {
          factMap.set(fact.field_id, fact.value[0]);
        }
      });

      // Check if all required fields are present
      const hasAllFields = requiredFields.every((field: any) => {
        const value = factMap.get(field.field_id);
        if (!value) return false;

        // Check criteria if present
        if (field.criteria) {
          return this.validateCriteria(value, field.criteria);
        }

        return true;
      });

      if (hasAllFields) {
        qualifiedCount++;
      }
    }

    return qualifiedCount;
  }

  private async getQualifications(
    applicantId: number | string,
    facts: ApplicantFact[],
  ): Promise<any[]> {
    const forms = await this.peopleRepository.findAllForms();
    const qualifications: any[] = [];

    const factMap = new Map<string, string>();
    // Group all facts by field_id - each row represents one data point
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

    for (const form of forms) {
      if (!form.policy?.required_fields) continue;

      const requiredFields = form.policy.required_fields;
      const missingFields: string[] = [];
      const failedCriteria: any[] = [];

      // Check each required field
      for (const field of requiredFields) {
        const value = factMap.get(field.field_id);
        if (!value) {
          missingFields.push(field.field_id);
          continue;
        }

        // Check criteria if present
        if (field.criteria) {
          if (!this.validateCriteria(value, field.criteria)) {
            failedCriteria.push({
              field_id: field.field_id,
              reason: `Failed criteria: ${field.criteria.op}`,
            });
          }
        }
      }

      const qualified = missingFields.length === 0 && failedCriteria.length === 0;
      let reason = 'Meets all eligibility criteria';
      if (!qualified) {
        if (missingFields.length > 0) {
          reason = `Missing required fields: ${missingFields.join(', ')}`;
        } else if (failedCriteria.length > 0) {
          reason = failedCriteria[0].reason;
        }
      }

      qualifications.push({
        programName: form.form_name,
        qualified,
        reason,
      });
    }

    return qualifications;
  }

  private validateCriteria(value: string, criteria: any): boolean {
    switch (criteria.op) {
      case 'valid_phone':
        // Basic phone validation
        return /^\+?[\d\s-()]+$/.test(value);
      case 'in':
        return criteria.values?.includes(value) || false;
      default:
        return true;
    }
  }
}
