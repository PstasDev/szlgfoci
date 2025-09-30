import { NextRequest, NextResponse } from 'next/server';

const isDevelopment = process.env.NODE_ENV === 'development';
const DJANGO_API_BASE = process.env.DJANGO_API_BASE || (isDevelopment 
  ? 'http://localhost:8000/api' 
  : 'https://fociapi.szlg.info/api');

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await context.params;
  
  try {
    console.log(`🔄 Next.js API Route: Fetching user ${userId} from Django backend...`);
    
    const response = await fetch(`${DJANGO_API_BASE}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Cache user data for 5 minutes (user info doesn't change often)
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`❌ Django API Error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `User not found` },
        { status: 404 }
      );
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched user ${userId} from Django:`, data);
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=150'
      }
    });
  } catch (error) {
    console.error(`❌ Error in user ${userId} API route:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}