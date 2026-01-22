export interface Person {
  id: number | string;
  trn?: string;
  fullName: string;
  phoneNumber?: string;
  division: string;
  formsApplied: number;
  formsQualified: number;
}

export interface PersonDetail {
  id: number | string;
  fullName: string;
  phoneNumber?: string;
  trn?: string;
  dateOfBirth: string;
  age?: number;
  gender?: string;
  nationality?: string;
  nationalId?: string;
  maritalStatus?: string;
  occupation?: string;
  division?: string;
  location?: string;
  residentialAddress?: {
    line1: string;
    line2: string;
  };
  primaryPhone?: string;
  emailAddress?: string;
  formsApplied: number;
  formsQualified: number;
  applications: Application[];
  qualifications: Qualification[];
}

export interface Application {
  id: number;
  formName: string;
  status: string;
  submittedDate: string;
  decisionDate?: string | null;
}

export interface Qualification {
  programName: string;
  qualified: boolean;
  reason: string;
}
