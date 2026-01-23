/**
 * Centralized API client for backend communication
 * Provides type-safe HTTP methods with error handling
 */

import { config } from './config';
import type { ApiErrorResponse } from './api-types';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: ApiErrorResponse,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Builds a URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, any>): string {
  const baseUrl = config.apiUrl;
  
  // If using proxy (relative URL), build relative path
  if (baseUrl.startsWith('/')) {
    const url = new URL(endpoint, 'http://dummy'); // Use dummy base for URL parsing
    const path = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, String(v)));
          } else {
            searchParams.set(key, String(value));
          }
        }
      });
      const queryString = searchParams.toString();
      return queryString ? `${path}?${queryString}` : path;
    }
    
    return path;
  }
  
  // Absolute URL (server-side)
  const url = new URL(endpoint, baseUrl);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, String(v)));
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    });
  }
  
  return url.toString();
}

/**
 * Handles API response and throws appropriate errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    let errorData: ApiErrorResponse | undefined;
    
    if (isJson) {
      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Failed to parse error response
      }
    }
    
    throw new ApiError(errorMessage, response.status, errorData);
  }
  
  if (isJson) {
    return response.json();
  }
  
  // Handle non-JSON responses (e.g., plain text)
  const text = await response.text();
  return text as unknown as T;
}

/**
 * Makes a GET request to the API
 */
export async function get<T>(
  endpoint: string,
  params?: Record<string, any>,
): Promise<T> {
  const url = buildUrl(endpoint, params);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      0,
    );
  }
}

/**
 * Makes a POST request to the API
 */
export async function post<T>(
  endpoint: string,
  body?: any,
): Promise<T> {
  const url = buildUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      0,
    );
  }
}

/**
 * Makes a PUT request to the API
 */
export async function put<T>(
  endpoint: string,
  body?: any,
): Promise<T> {
  const url = buildUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      0,
    );
  }
}

/**
 * Makes a DELETE request to the API
 */
export async function del<T>(endpoint: string): Promise<T> {
  const url = buildUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      0,
    );
  }
}
