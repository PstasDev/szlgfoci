import { NextRequest, NextResponse } from 'next/server';

// Allow configuring the Django backend URL via environment variable (server-side only).
// Default to localhost when not provided.
const DJANGO_API_BASE = process.env.DJANGO_API_BASE || 'http://localhost:8000/api';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Next.js API Route: Fetching tournaments from Django backend...');
    
    const response = await fetch(`${DJANGO_API_BASE}/tournaments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`❌ Django API Error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Django API Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully fetched tournaments from Django:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error in tournaments API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
      { status: 500 }
    );
  }
}