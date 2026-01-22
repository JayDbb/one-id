export interface Application {
  id: number;
  applicantName: string;
  citizenId: string;
  applicationName: string;
  dateApplied: string;
  division: string;
  status: string;
}

export interface ApplicationDetail extends Application {
  applicantId: number;
  formId: string;
  createdAt: string;
  applicantFacts?: Record<string, any>;
  formPolicy?: any;
}
