const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
}

export interface Person {
  id: number | string;
  trn?: string;
  fullName: string;
  phoneNumber?: string;
  division: string;
  formsApplied: number;
  formsQualified: number;
}

export interface PersonApplication {
  id: number;
  formName: string;
  status: string;
  submittedDate: string;
  decisionDate?: string | null;
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
  applications: PersonApplication[];
  qualifications: Qualification[];
}

export interface Application {
  id: number;
  applicantName: string;
  citizenId: string;
  applicationName: string;
  dateApplied: string;
  division: string;
  status: "under-review" | "approved" | "draft" | "declined" | "applied";
}

export interface Qualification {
  programName: string;
  qualified: boolean;
  reason: string;
}

export interface Program {
  id: string;
  name: string;
  shortName?: string;
  status: "active" | "upcoming" | "closed";
  fieldRequirements: number;
  currentApplications: number;
  isCDF?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const error = await response.json();
        errorMessage = error.message || error.error || response.statusText;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // People endpoints
  async getPeople(params?: {
    search?: string;
    division?: string;
    program?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Person[]>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.division) queryParams.append('division', params.division);
    if (params?.program) queryParams.append('program', params.program);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    return this.request<ApiResponse<Person[]>>(
      `/people${queryString ? `?${queryString}` : ''}`,
    );
  }

  async getPerson(id: string): Promise<PersonDetail> {
    return this.request<PersonDetail>(`/people/${id}`);
  }

  // Applications endpoints
  async getApplications(params?: {
    status?: string;
    division?: string;
    form_id?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Application[]>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.division) queryParams.append('division', params.division);
    if (params?.form_id) queryParams.append('form_id', params.form_id);
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    return this.request<ApiResponse<Application[]>>(
      `/applications${queryString ? `?${queryString}` : ''}`,
    );
  }

  async getApplication(id: string): Promise<Application> {
    return this.request<Application>(`/applications/${id}`);
  }

  async submitApplication(data: {
    form_id: string;
    applicant_id: string;
    status?: string;
  }): Promise<{ message: string; application: any }> {
    return this.request<{ message: string; application: any }>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Forms/Programs endpoints
  async getForms(): Promise<Program[]> {
    return this.request<Program[]>('/forms');
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<{
    totalApplications: number;
    activeForms: number;
    totalApplicants: number;
    pendingApplications: number;
  }> {
    return this.request('/dashboard/stats');
  }

  async getDashboardAnalytics(): Promise<{
    data: number[];
    labels: string[];
    total: number;
  }> {
    return this.request('/dashboard/analytics');
  }

  async getRecentApplications(): Promise<{
    formId: string;
    formName: string;
    applicants: number;
    status: string;
    createdAt: string;
  }[]> {
    return this.request('/dashboard/recent-applications');
  }

  async getApplicationStatus(): Promise<{
    total: number;
    approved: number;
    pending: number;
    declined: number;
    submitted: number;
    inProgress: number;
  }> {
    return this.request('/dashboard/application-status');
  }

  async getActiveForms(): Promise<{
    formName: string;
    formId: string;
    version: number;
    isActive: boolean;
    applicants: number;
  }[]> {
    return this.request('/dashboard/active-forms');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
