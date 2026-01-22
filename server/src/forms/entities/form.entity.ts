export interface Form {
  id: string;
  name: string;
  shortName?: string;
  status: 'active' | 'upcoming' | 'closed';
  fieldRequirements: number;
  currentApplications: number;
  isCDF?: boolean;
}
