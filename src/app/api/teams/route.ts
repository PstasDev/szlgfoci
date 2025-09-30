import { NextResponse } from 'next/server';

const DJANGO_API_BASE = process.env.DJANGO_API_BASE || 'http://localhost:8000/api';

export async function GET() {
  try {
    console.log('🔄 Next.js API Route: Fetching teams from Django backend...');
    
    const response = await fetch(`${DJANGO_API_BASE}/teams`, {
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
    console.log('✅ Successfully fetched teams from Django:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error in teams API route:', error);
    return NextResponse.json([]);
  }
}