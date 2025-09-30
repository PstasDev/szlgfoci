import { NextResponse } from 'next/server';

const DJANGO_API_BASE = process.env.DJANGO_API_BASE || 'http://localhost:8000/api';

export async function GET() {
  try {
    console.log('🔍 Debug endpoint called');
    console.log('🔍 DJANGO_API_BASE:', DJANGO_API_BASE);
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
    
    // Test connection to Django backend
    let djangoStatus = 'unknown';
    let djangoError = null;
    
    try {
      console.log('🔍 Testing Django connection...');
      const response = await fetch(`${DJANGO_API_BASE}/tournament/current`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
      
      djangoStatus = response.ok ? 'connected' : `error-${response.status}`;
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to read error');
        djangoError = `${response.status} ${response.statusText}: ${errorText}`;
      }
      console.log('🔍 Django response status:', response.status, response.statusText);
    } catch (error) {
      djangoStatus = 'connection-failed';
      djangoError = error instanceof Error ? error.message : String(error);
      console.log('🔍 Django connection failed:', error);
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DJANGO_API_BASE,
      },
      django: {
        status: djangoStatus,
        error: djangoError,
        url: `${DJANGO_API_BASE}/tournament/current`
      },
      nextjs: {
        version: process.version,
        status: 'running'
      }
    });
  } catch (error) {
    console.error('🔍 Debug endpoint error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}