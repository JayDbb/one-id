/**
 * React hooks for API data fetching
 * Provides loading, error, and data states with refetch capability
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { get, ApiError } from '@/lib/api-client';
import type {
  ApiApplication,
  ApiApplicationDetail,
  ApiPerson,
  ApiPersonDetail,
  ApiPaginatedResponse,
  GetApplicationsParams,
  GetPeopleParams,
  ApiDashboardStats,
  ApiDashboardAnalytics,
  ApiRecentApplication,
  ApiApplicationStatus,
  ApiActiveForm,
  ApiFormEntity,
  ApiForm,
  ApiFieldRegistry,
  GetFieldRegistryParams,
  ApiApplicantFact,
  GetApplicantFactsParams,
} from '@/lib/api-types';
import {
  transformApplication,
  transformApplicationDetail,
  transformPerson,
  transformPersonDetail,
  transformFormToProgram,
} from '@/lib/transformers';
import type { Application, Person, Program } from '@/lib/mock-data';

// ============================================================================
// Generic Hook Type
// ============================================================================

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// ============================================================================
// Applications Hooks
// ============================================================================

export function useApplications(
  filters?: GetApplicationsParams,
): UseApiResult<Application[]> {
  const [data, setData] = useState<Application[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize filters to prevent infinite loops - use individual properties for dependency tracking
  const memoizedFilters = useMemo(() => filters, [
    filters?.status,
    filters?.division,
    filters?.form_id,
    filters?.dateFrom,
    filters?.dateTo,
    filters?.page,
    filters?.limit,
  ]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<ApiPaginatedResponse<ApiApplication>>(
        '/applications',
        memoizedFilters,
      );
      
      // Handle both paginated response and direct array response
      if (!response) {
        throw new Error('Empty response from server');
      }
      
      const applicationsData = response?.data || (Array.isArray(response) ? response : []);
      
      if (!Array.isArray(applicationsData)) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format: expected array or paginated response');
      }
      
      const transformed = applicationsData.map((app) => transformApplication(app));
      setData(transformed);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch applications';
      setError(new Error(errorMessage));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useApplication(id: string): UseApiResult<Application> & { rawDetail: ApiApplicationDetail | null } {
  const [data, setData] = useState<Application | null>(null);
  const [rawDetail, setRawDetail] = useState<ApiApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await get<ApiApplicationDetail>(`/applications/${id}`);
      setRawDetail(response);
      const transformed = transformApplicationDetail(response);
      setData(transformed);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch application'));
      setData(null);
      setRawDetail(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, rawDetail };
}

// ============================================================================
// People Hooks
// ============================================================================

export function usePeople(
  filters?: GetPeopleParams,
): UseApiResult<Person[]> {
  const [data, setData] = useState<Person[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize filters to prevent infinite loops - use individual properties for dependency tracking
  const memoizedFilters = useMemo(() => filters, [
    filters?.search,
    filters?.division,
    filters?.program,
    filters?.status,
    filters?.page,
    filters?.limit,
  ]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<ApiPaginatedResponse<ApiPerson>>(
        '/people',
        memoizedFilters,
      );
      
      // Handle both paginated response and direct array response
      if (!response) {
        throw new Error('Empty response from server');
      }
      
      const peopleData = response?.data || (Array.isArray(response) ? response : []);
      
      if (!Array.isArray(peopleData)) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format: expected array or paginated response');
      }
      
      const transformed = peopleData.map((person) => transformPerson(person));
      setData(transformed);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch people';
      setError(new Error(errorMessage));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function usePerson(id: string): UseApiResult<Person> & { rawDetail: ApiPersonDetail | null } {
  const [data, setData] = useState<Person | null>(null);
  const [rawDetail, setRawDetail] = useState<ApiPersonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await get<ApiPersonDetail>(`/people/${id}`);
      setRawDetail(response);
      const transformed = transformPersonDetail(response);
      setData(transformed);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch person'));
      setData(null);
      setRawDetail(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, rawDetail };
}

// ============================================================================
// Field Registry Hooks
// ============================================================================

export function useFieldRegistry(
  params?: GetFieldRegistryParams,
): UseApiResult<ApiFieldRegistry[]> {
  const [data, setData] = useState<ApiFieldRegistry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<ApiFieldRegistry[]>('/form-registry', params);
      
      if (!response || !Array.isArray(response)) {
        throw new Error('Invalid response format: expected array');
      }
      
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch field registry'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [params?.fields]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// Applicant Facts Hooks
// ============================================================================

export function useApplicantFacts(
  params?: GetApplicantFactsParams,
): UseApiResult<ApiApplicantFact[]> {
  const [data, setData] = useState<ApiApplicantFact[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedParams = useMemo(() => params, [
    params?.trn,
    params?.phoneNumber,
    params?.user_id,
  ]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<ApiApplicantFact[]>('/applicant-facts', memoizedParams);
      
      if (!response || !Array.isArray(response)) {
        throw new Error('Invalid response format: expected array');
      }
      
      setData(response);
    } catch (err) {
      // Don't treat 404 as an error if we're querying by user_id (user might not have facts yet)
      if (err instanceof ApiError && err.statusCode === 404 && memoizedParams?.user_id) {
        setData([]);
      } else {
        setError(err instanceof Error ? err : new Error('Failed to fetch applicant facts'));
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, [memoizedParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// Dashboard Hooks
// ============================================================================

export function useDashboardStats(): UseApiResult<ApiDashboardStats> {
  const [data, setData] = useState<ApiDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<ApiDashboardStats>('/dashboard/stats');
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard stats'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useDashboardAnalytics(): UseApiResult<ApiDashboardAnalytics> {
  const [data, setData] = useState<ApiDashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<ApiDashboardAnalytics>('/dashboard/analytics');
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useRecentApplications(): UseApiResult<ApiRecentApplication[]> {
  const [data, setData] = useState<ApiRecentApplication[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<ApiRecentApplication[]>('/dashboard/recent-applications');
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch recent applications'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useApplicationStatus(): UseApiResult<ApiApplicationStatus> {
  const [data, setData] = useState<ApiApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<ApiApplicationStatus>('/dashboard/application-status');
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch application status'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useActiveForms(): UseApiResult<ApiActiveForm[]> {
  const [data, setData] = useState<ApiActiveForm[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<ApiActiveForm[]>('/dashboard/active-forms');
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch active forms'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// Forms Hooks
// ============================================================================

export function useForms(): UseApiResult<Program[]> {
  const [data, setData] = useState<Program[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<ApiFormEntity[]>('/forms');
      
      if (!response || !Array.isArray(response)) {
        throw new Error('Invalid response format: expected array');
      }
      
      const transformed = response.map((form) => transformFormToProgram(form));
      setData(transformed);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch forms'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useForm(id: string): UseApiResult<Program> {
  const [data, setData] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Decode URL-encoded ID
      const decodedId = decodeURIComponent(id);
      
      // First try to get form from /forms list
      const formsResponse = await get<ApiFormEntity[]>('/forms');
      
      if (!formsResponse || !Array.isArray(formsResponse)) {
        throw new Error('Invalid response format: expected array');
      }
      
      // Try multiple matching strategies
      const form = formsResponse.find((f) => {
        // Exact match (case-sensitive)
        if (f.id === decodedId || f.name === decodedId) return true;
        
        // Exact match (case-insensitive)
        if (f.id.toLowerCase() === decodedId.toLowerCase() || 
            f.name.toLowerCase() === decodedId.toLowerCase()) return true;
        
        // Match with original encoded ID
        if (f.id === id || f.name === id) return true;
        
        // Match shortName if available
        if (f.shortName && (f.shortName === decodedId || f.shortName === id)) return true;
        
        return false;
      });
      
      if (!form) {
        // Log available forms for debugging
        console.warn('Form not found. Available forms:', formsResponse.map(f => ({ id: f.id, name: f.name })));
        throw new Error(`Form not found: ${decodedId}`);
      }
      
      const transformed = transformFormToProgram(form);
      setData(transformed);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch form'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
