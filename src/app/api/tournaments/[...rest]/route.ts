import { NextRequest, NextResponse } from 'next/server';

const DJANGO_API_BASE = process.env.DJANGO_API_BASE || 'http://localhost:8000/api';

export async function GET(request: NextRequest, { params }: { params: { rest: string[] } }) {
  const rest = params?.rest || [];
  const suffix = rest.length > 0 ? `/${rest.join('/')}` : '';

  const url = `${DJANGO_API_BASE}/tournaments${suffix}${request.nextUrl.search ?? ''}`;
  try {
    console.log(`🔁 Proxying GET ${request.nextUrl.pathname} -> ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.warn(`⚠️ Django returned ${response.status} for ${url}`);
      // Provide sensible fallbacks so the frontend can continue rendering
      if (rest.length === 0) {
        // tournaments list fallback
        return NextResponse.json([
          {
            id: 2,
            name: 'Demo Tournament',
            start_date: new Date().toISOString(),
            registration_open: false
          }
        ]);
      }

      // If asking for a single tournament id, return a demo tournament
      if (rest.length === 1 && !isNaN(Number(rest[0]))) {
        const id = Number(rest[0]);
        return NextResponse.json({
          id,
          name: `Demo Tournament #${id}`,
          start_date: new Date().toISOString(),
          registration_open: false
        });
      }

      // For other endpoints (matches, standings, etc.) return empty array as fallback
      return NextResponse.json([]);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error proxying to Django:', error);
    // Provide the same safe fallbacks on network/server error
    if (rest.length === 0) {
      return NextResponse.json([
        {
          id: 2,
          name: 'Demo Tournament',
          start_date: new Date().toISOString(),
          registration_open: false
        }
      ]);
    }

    if (rest.length === 1 && !isNaN(Number(rest[0]))) {
      const id = Number(rest[0]);
      return NextResponse.json({
        id,
        name: `Demo Tournament #${id}`,
        start_date: new Date().toISOString(),
        registration_open: false
      });
    }

    return NextResponse.json([]);
  }
}
