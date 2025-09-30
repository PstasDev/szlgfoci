import { NextResponse } from 'next/server';

const DJANGO_API_BASE = process.env.DJANGO_API_BASE || 'http://localhost:8000/api';

export async function GET() {
  try {
    console.log('🔄 Next.js API Route: Fetching current tournament from Django backend...');
    
    const response = await fetch(`${DJANGO_API_BASE}/tournament/current`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`❌ Django API Error: ${response.status} ${response.statusText}`);
      // Return a fallback current tournament
      return NextResponse.json({
        id: 1,
        name: 'Demo Tournament',
        start_date: new Date().toISOString(),
        registration_open: false
      });
    }

    const data = await response.json();
    console.log('✅ Successfully fetched current tournament from Django:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error in current tournament API route:', error);
    return NextResponse.json({
      id: 1,
      name: 'Demo Tournament',
      start_date: new Date().toISOString(),
      registration_open: false
    });
  }
}