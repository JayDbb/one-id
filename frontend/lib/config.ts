/**
 * Application configuration
 * Centralized access to environment variables with defaults
 */

// Use proxy in browser to avoid CORS, direct URL in server-side
export const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: use direct URL
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }
  // Client-side: use proxy to avoid CORS
  return '/api/proxy';
};

export const config = {
  /**
   * API base URL for backend server
   * Uses proxy in browser, direct URL on server
   */
  get apiUrl() {
    return getApiUrl();
  },
} as const;
