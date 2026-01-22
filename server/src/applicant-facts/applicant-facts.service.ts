import { Injectable } from '@nestjs/common';
import { ApplicantFactsRepository } from './applicant-facts.repository';
import { GetApplicantFactDto } from './dto/get-applicant-fact.dto';
import { ApplicantFact } from './entities/applicant-fact.entity';

@Injectable()
export class ApplicantFactsService {
  private readonly FIELD_IDS = {
    TRN: 'applicant.tax_registration_number',
    PHONE_NUMBER: 'applicant.phone_number',
  };

  constructor(
    private readonly applicantFactsRepository: ApplicantFactsRepository,
  ) {}

  async findByQuery(query: GetApplicantFactDto): Promise<ApplicantFact[]> {
    const { trn, phoneNumber } = query;

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
