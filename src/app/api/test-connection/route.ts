import { NextResponse } from 'next/server';

export async function GET() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const DJANGO_API_BASE = process.env.DJANGO_API_BASE || (isDevelopment 
    ? 'http://localhost:8000/api' 
    : 'https://fociapi.szlg.info/api');

  const testUrls = [
    `${DJANGO_API_BASE}/kozlemenyek/active`,
    `${DJANGO_API_BASE}/tournament/current`,
    'http://localhost:8000/api/kozlemenyek/active',
    'https://fociapi.szlg.info/api/kozlemenyek/active'
  ];

  const results = [];

  for (const url of testUrls) {
    try {
      console.log(`🔍 Testing URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        // Short timeout for testing
        signal: AbortSignal.timeout(5000)
      });

      const result: any = {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      };

      if (response.ok) {
        try {
          const data = await response.json();
          result.dataType = Array.isArray(data) ? `array(${data.length})` : typeof data;
          result.sample = Array.isArray(data) ? data.slice(0, 1) : data;
        } catch {
          result.dataType = 'non-json';
        }
      } else {
        try {
          result.error = await response.text();
        } catch {
          result.error = 'Unable to read error';
        }
      }

      results.push(result);
    } catch (error) {
      results.push({
        url,
        error: error instanceof Error ? error.message : String(error),
        status: 'fetch_failed'
      });
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    DJANGO_API_BASE,
    testResults: results
  });
}