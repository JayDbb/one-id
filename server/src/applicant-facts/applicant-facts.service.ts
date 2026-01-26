import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ApplicantFactsRepository } from './applicant-facts.repository';
import { CreateApplicantFactDto } from './dto/create-applicant-fact.dto';
import { GetApplicantFactDto } from './dto/get-applicant-fact.dto';
import { ApplicantFact } from './entities/applicant-fact.entity';

@Injectable()
export class ApplicantFactsService {
  private readonly FIELD_IDS = {
    TRN: 'applicant.tax_registration_number',
    PHONE_NUMBER: 'applicant.phone_number',
  };

  private readonly DEFAULT_VALUES = {
    STATUS: 'pending',
    SOURCE: 'whatsapp',
    IS_CURRENT: true,
  };

  constructor(
    private readonly applicantFactsRepository: ApplicantFactsRepository,
  ) {}

  /**
   * Sanitizes a phone number by removing all non-numeric characters
   */
  private sanitizePhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\D/g, '');
  }

  async create(dto: CreateApplicantFactDto): Promise<ApplicantFact> {
    // Sanitize the phone number
    const cleanPhoneNumber = this.sanitizePhoneNumber(dto.phone_number);

    // Look up user_id from the phone number
    let userId =
      await this.applicantFactsRepository.findUserIdByPhoneNumber(
        cleanPhoneNumber,
      );

    // If no existing user_id found, generate a new one
    if (!userId) {
      userId = randomUUID();
    }

    // If the field is phone_number, sanitize the value as well
    const cleanValue =
      dto.field_id === this.FIELD_IDS.PHONE_NUMBER
        ? dto.value.map((v) => this.sanitizePhoneNumber(v))
        : dto.value;

    const data = {
      field_id: dto.field_id,
      value: cleanValue,
      status: this.DEFAULT_VALUES.STATUS,
      source: this.DEFAULT_VALUES.SOURCE,
      is_current: this.DEFAULT_VALUES.IS_CURRENT,
      user_id: userId,
    };

    return this.applicantFactsRepository.create(data);
  }

  async update(
    fieldId: string,
    phoneNumber: string,
    value: string[],
  ): Promise<ApplicantFact> {
    // Sanitize the phone number
    const cleanPhoneNumber = this.sanitizePhoneNumber(phoneNumber);

    // Look up user_id from the phone number
    let userId =
      await this.applicantFactsRepository.findUserIdByPhoneNumber(
        cleanPhoneNumber,
      );

    // If no user_id found, generate a new one
    if (!userId) {
      userId = randomUUID();
    }

    // If updating phone_number field, sanitize the value
    const cleanValue =
      fieldId === this.FIELD_IDS.PHONE_NUMBER
        ? value.map((v) => this.sanitizePhoneNumber(v))
        : value;

    // Try to update existing record
    const updatedFact = await this.applicantFactsRepository.updateByUserIdAndFieldId(
      userId,
      fieldId,
      cleanValue,
    );

    // If no record found, create a new one
    if (!updatedFact) {
      const data = {
        field_id: fieldId,
        value: cleanValue,
        status: this.DEFAULT_VALUES.STATUS,
        source: this.DEFAULT_VALUES.SOURCE,
        is_current: this.DEFAULT_VALUES.IS_CURRENT,
        user_id: userId,
      };

      return this.applicantFactsRepository.create(data);
    }

    return updatedFact;
  }

  async findByQuery(query: GetApplicantFactDto): Promise<ApplicantFact[]> {
    const { trn, phoneNumber, user_id } = query;

    // If user_id is provided, return all facts for that user
    if (user_id) {
      return this.applicantFactsRepository.findAllByUserId(user_id);
    }

    // If no search parameters provided, return empty array
    if (!trn && !phoneNumber) {
      return [] as ApplicantFact[];
    }

    const results: ApplicantFact[] = [];

    // Query by TRN if provided
    if (trn) {
      const trnFact =
        await this.applicantFactsRepository.findOneByFieldAndValue(
          this.FIELD_IDS.TRN,
          trn,
        );
      if (trnFact) {
        results.push(trnFact);
      }
    }

    // Query by phone number if provided
    if (phoneNumber) {
      const phoneFact =
        await this.applicantFactsRepository.findOneByFieldAndValue(
          this.FIELD_IDS.PHONE_NUMBER,
          phoneNumber,
        );
      if (phoneFact) {
        results.push(phoneFact);
      }
    }

    // Remove duplicates based on id
    const uniqueResults = this.removeDuplicates(results);

    return uniqueResults;
  }

  private removeDuplicates(facts: ApplicantFact[]): ApplicantFact[] {
    const seen = new Set<number>();
    return facts.filter((fact) => {
      if (seen.has(fact.id)) {
        return false;
      }
      seen.add(fact.id);
      return true;
    });
  }
}
