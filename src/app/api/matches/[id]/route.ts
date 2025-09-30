import { NextRequest, NextResponse } from 'next/server';

const DJANGO_API_BASE = process.env.DJANGO_API_BASE || 'http://localhost:8000/api';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: matchId } = await context.params;
  
  try {
    console.log(`🔄 Next.js API Route: Fetching match ${matchId} from Django backend...`);
    
    const response = await fetch(`${DJANGO_API_BASE}/matches/${matchId}`, {
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
        { error: `Match not found` },
        { status: 404 }
      );
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched match ${matchId} from Django:`, data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`❌ Error in match ${matchId} API route:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    );
  }
}