import { NextResponse } from 'next/server';

const DJANGO_API_BASE = process.env.DJANGO_API_BASE || 'http://localhost:8000/api';

export async function GET() {
  try {
    console.log('🔄 Next.js API Route: Fetching players from Django backend...');
    
    const response = await fetch(`${DJANGO_API_BASE}/players`, {
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
    console.log('✅ Successfully fetched players from Django:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error in players API route:', error);
    return NextResponse.json([]);
  }
}