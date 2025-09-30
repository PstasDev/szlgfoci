import { NextResponse } from 'next/server';

const isDevelopment = process.env.NODE_ENV === 'development';
const DJANGO_API_BASE = process.env.DJANGO_API_BASE || (isDevelopment 
  ? 'http://localhost:8000/api' 
  : 'https://fociapi.szlg.info/api');

export async function GET() {
  try {
    console.log('🔄 Next.js API Route: Fetching topscorers from Django backend...');
    
    const response = await fetch(`${DJANGO_API_BASE}/topscorers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`❌ Django API Error: ${response.status} ${response.statusText}`);
      return NextResponse.json([]);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched topscorers from Django:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error in topscorers API route:', error);
    return NextResponse.json([]);
  }
}