// API configuration and utilities for SZLG Foci application

interface ApiError extends Error {
  status?: number;
  statusText?: string;
}

// Direct API calls to Django backend
// In development: localhost:8000/api
// In production: fociapi.szlg.info/api
const getApiBaseUrl = () => {
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    // Client-side: detect based on hostname
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.startsWith('192.168.') ||
                       window.location.hostname.startsWith('10.') ||
                       window.location.hostname.startsWith('172.');
    return isLocalhost ? 'http://localhost:8000/api' : 'https://fociapi.szlg.info/api';
  } else {
    // Server-side: use environment variable
    const isDevelopment = process.env.NODE_ENV === 'development';
    return isDevelopment ? 'http://localhost:8000/api' : 'https://fociapi.szlg.info/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

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
      mode: 'cors', // Enable CORS for cross-origin requests
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
      mode: 'cors', // Enable CORS for cross-origin requests
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

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors', // Enable CORS for cross-origin requests
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

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors', // Enable CORS for cross-origin requests
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
