import { NextResponse } from 'next/server';

const isDevelopment = process.env.NODE_ENV === 'development';
// Common Django development server URLs to try
const DJANGO_API_BASE = process.env.DJANGO_API_BASE || (isDevelopment 
  ? (process.env.DJANGO_LOCAL_URL || 'http://localhost:8000/api')
  : 'https://fociapi.szlg.info/api');

export async function GET() {
  try {
    console.log('📢 Fetching active announcements from backend...');
    console.log('📢 NODE_ENV:', process.env.NODE_ENV);
    console.log('📢 isDevelopment:', isDevelopment);
    console.log('📢 DJANGO_API_BASE:', DJANGO_API_BASE);
    console.log('📢 Full URL:', `${DJANGO_API_BASE}/kozlemenyek/active`);
    
    const response = await fetch(`${DJANGO_API_BASE}/kozlemenyek/active`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Enhanced cache control for announcements - 2 minutes cache
      next: { revalidate: 120 },
    });

    console.log('📢 Response status:', response.status, response.statusText);
    console.log('📢 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error text');
      console.error(`❌ Backend error for announcements: ${response.status} ${response.statusText}`);
      console.error(`❌ Failed URL: ${DJANGO_API_BASE}/kozlemenyek/active`);
      console.error(`❌ Error response:`, errorText);
      return NextResponse.json([], {
        status: 200, // Return empty array instead of error to prevent breaking the UI
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=30'
        }
      });
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.length} active announcements`);
    console.log('📢 Announcements data:', data);
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=120, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    console.error('❌ Error in announcements API route:', error);
    console.error(`❌ Failed URL: ${DJANGO_API_BASE}/kozlemenyek/active`);
    return NextResponse.json([], {
      status: 200, // Return empty array instead of error
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30'
      }
    });
  }
}