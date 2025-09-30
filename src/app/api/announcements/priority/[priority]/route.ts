import { NextRequest, NextResponse } from 'next/server';

const DJANGO_API_BASE = process.env.DJANGO_API_BASE || 'http://localhost:8000/api';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ priority: string }> }
) {
  const { priority } = await context.params;
  
  try {
    console.log(`🔄 Next.js API Route: Fetching announcements with priority ${priority} from Django backend...`);
    
    const response = await fetch(`${DJANGO_API_BASE}/kozlemenyek/priority/${priority}`, {
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
    console.log(`✅ Successfully fetched ${data.length} announcements with priority ${priority} from Django:`, data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`❌ Error in announcements priority ${priority} API route:`, error);
    return NextResponse.json([]);
  }
}