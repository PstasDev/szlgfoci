import { NextResponse } from 'next/server';

const isDevelopment = process.env.NODE_ENV === 'development';
const DJANGO_API_BASE = process.env.DJANGO_API_BASE || (isDevelopment 
  ? 'http://localhost:8000/api' 
  : 'https://fociapi.szlg.info/api');

export async function GET() {
  try {
    console.log('🔄 Next.js API Route: Fetching teams from Django backend...');
    
    const response = await fetch(`${DJANGO_API_BASE}/teams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Add cache for teams data - 5 minutes
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`❌ Django API Error: ${response.status} ${response.statusText}`);
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=30'
        }
      });
    }

    const data = await response.json();
    console.log('✅ Successfully fetched teams from Django:', data);
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=150'
      }
    });
  } catch (error) {
    console.error('❌ Error in teams API route:', error);
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30'
      }
    });
  }
}