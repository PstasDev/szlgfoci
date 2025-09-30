import { NextResponse } from 'next/server';

export async function GET() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const DJANGO_API_BASE = process.env.DJANGO_API_BASE || (isDevelopment 
    ? 'http://localhost:8000/api' 
    : 'https://fociapi.szlg.info/api');

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    isDevelopment,
    DJANGO_API_BASE,
    envVariables: {
      NODE_ENV: process.env.NODE_ENV,
      DJANGO_API_BASE: process.env.DJANGO_API_BASE || 'not set',
    },
    expectedAnnouncementsUrl: `${DJANGO_API_BASE}/kozlemenyek/active`,
    timestamp: new Date().toISOString()
  });
}