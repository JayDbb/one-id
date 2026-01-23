/**
 * TypeScript interfaces matching server API responses
 * These types correspond to the NestJS backend entities and DTOs
 */

// ============================================================================
// Applications
// ============================================================================

export interface ApiApplication {
  id: number;
  applicantName: string;
  citizenId: string;
  applicationName: string;
  dateApplied: string;
  division: string;
  status: string;
}

export interface ApiApplicationDetail extends ApiApplication {
  applicantId: number;
  formId: string;
  createdAt: string;
  applicantFacts?: Record<string, any>;
  formPolicy?: any;
}

export interface GetApplicationsParams {
  status?: string;
  division?: string;
  form_id?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// People
// ============================================================================

export interface ApiPerson {
  id: number | string;
  trn?: string;
  fullName: string;
  phoneNumber?: string;
  division: string;
  formsApplied: number;
  formsQualified: number;
}

export interface ApiPersonApplication {
  id: number;
  formName: string;
  status: string;
  submittedDate: string;
  decisionDate?: string | null;
}

export interface ApiQualification {
  programName: string;
  qualified: boolean;
  reason: string;
}

export interface ApiPersonDetail {
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
  applications: ApiPersonApplication[];
  qualifications: ApiQualification[];
}

export interface GetPeopleParams {
  search?: string;
  division?: string;
  program?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// Dashboard
// ============================================================================

export interface ApiDashboardStats {
  totalApplications: number;
  activeForms: number;
  totalApplicants: number;
  pendingReview: number;
}

export interface ApiDashboardAnalytics {
  days: string[];
  data: number[];
  total: number;
}

export interface ApiRecentApplication {
  formId: string;
  applicants: number;
  status: string;
  createdAt: string;
}

export interface ApiApplicationStatus {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  completedPercent: number;
}

export interface ApiActiveForm {
  formName: string;
  version: number;
  isActive: boolean;
  applicants: number;
}

// ============================================================================
// Pagination
// ============================================================================

export interface ApiPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ============================================================================
// Forms
// ============================================================================

// Form from /forms endpoint (Form entity)
export interface ApiFormEntity {
  id: string;
  name: string;
  shortName?: string;
  status: 'active' | 'upcoming' | 'closed';
  fieldRequirements: number;
  currentApplications: number;
  isCDF?: boolean;
}

// Form from /form endpoint (form_criteria)
export interface ApiForm {
  form_name: string;
  policy?: any;
  shorten_name?: string;
}

// Form detail with policy information
export interface ApiFormDetail extends ApiForm {
  policy: any;
}

export interface ApiFormRequirement {
  field_id: string;
  label?: string;
  title?: string;
  type?: string;
  validation?: any;
  prompt_template?: string;
}

export interface GetFormRequirementsParams {
  form_name?: string;
  phone_number?: string;
}

// ============================================================================
// Eligibility
// ============================================================================

export interface GetEligibilityParams {
  phone_number: string;
}

// ============================================================================
// Applicant Facts
// ============================================================================

export interface ApiApplicantFact {
  id: number;
  field_id: string;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
  is_current: boolean;
  value: string[];
  user_id: string;
}

export interface CreateApplicantFactDto {
  field_id: string;
  value: string[];
  phone_number: string;
}

export interface GetApplicantFactsParams {
  trn?: string;
  phoneNumber?: string;
  user_id?: string;
}

// ============================================================================
// Field Registry
// ============================================================================

export interface ApiFieldRegistry {
  field_id: string;
  title: string;
  prompt_template?: string;
  type: string;
  validation?: any;
  normalizers?: any;
  aliases?: any;
  category?: string;
}

export interface GetFieldRegistryParams {
  fields?: string; // Comma-separated list of fields to return
}

// ============================================================================
// Error Response
// ============================================================================

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}
