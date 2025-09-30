import { NextRequest, NextResponse } from 'next/server';

const DJANGO_API_BASE = process.env.DJANGO_API_BASE || 'http://localhost:8000/api';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const teamId = params.id;
  
  try {
    console.log(`🔄 Next.js API Route: Fetching team ${teamId} from Django backend...`);
    
    const response = await fetch(`${DJANGO_API_BASE}/teams/${teamId}`, {
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
        { error: `Team not found` },
        { status: 404 }
      );
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched team ${teamId} from Django:`, data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`❌ Error in team ${teamId} API route:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch team' },
      { status: 500 }
    );
  }
}