// API configuration and utilities for SZLG Foci application

interface ApiError extends Error {
  status?: number;
  statusText?: string;
}

// Use Next.js API routes as proxy to Django backend to avoid CORS issues.
// In development: use local Next.js API routes that can proxy to local Django server
// In production: use Next.js API routes that proxy to production Django server
const API_BASE_URL = '/api';

// Export base so other modules can reuse it if needed
export const baseURL = API_BASE_URL;

export const api = {
  baseURL: API_BASE_URL,

  async get<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🌐 API GET request to: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`❌ API Error: ${response.status} ${response.statusText}`, errorText);
      const error: ApiError = new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    const data = await response.json();
    console.log(`✅ API Response from ${url}:`, data);
    return data;
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error: ApiError = new Error(`API Error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    return response.json();
  },

  // Utility method for handling errors
  handleError(error: unknown) {
    console.error('API Error:', error);
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  }
};
