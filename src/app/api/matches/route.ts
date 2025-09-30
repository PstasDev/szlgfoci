import { NextResponse } from 'next/server';

const isDevelopment = process.env.NODE_ENV === 'development';
const DJANGO_API_BASE = process.env.DJANGO_API_BASE || (isDevelopment 
  ? 'http://localhost:8000/api' 
  : 'https://fociapi.szlg.info/api');

export async function GET() {
  try {
    console.log('🔄 Next.js API Route: Fetching matches from Django backend...');
    
    const response = await fetch(`${DJANGO_API_BASE}/matches`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Cache matches for 1 minute (live data should be fresher)
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`❌ Django API Error: ${response.status} ${response.statusText}`);
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'public, max-age=30, stale-while-revalidate=15'
        }
      });
    }

    const data = await response.json();
    console.log('✅ Successfully fetched matches from Django:', data);
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('❌ Error in matches API route:', error);
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=15'
      }
    });
  }
}