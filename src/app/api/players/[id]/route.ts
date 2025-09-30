import { NextRequest, NextResponse } from 'next/server';

const DJANGO_API_BASE = process.env.DJANGO_API_BASE || 'http://localhost:8000/api';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const playerId = params.id;
  
  try {
    console.log(`🔄 Next.js API Route: Fetching player ${playerId} from Django backend...`);
    
    const response = await fetch(`${DJANGO_API_BASE}/players/${playerId}`, {
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
        { error: `Player not found` },
        { status: 404 }
      );
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched player ${playerId} from Django:`, data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`❌ Error in player ${playerId} API route:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 }
    );
  }
}