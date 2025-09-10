// API configuration and utilities for SZLG Foci application
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment ? 'http://localhost:8000/api' : 'https://fociapi.szlg.info/api';

export const api = {
  baseURL: API_BASE_URL,

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // Utility method for handling errors
  handleError(error: any) {
    console.error('API Error:', error);
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  }
};
