import { NextResponse } from 'next/server';

const isDevelopment = process.env.NODE_ENV === 'development';
const DJANGO_API_BASE = process.env.DJANGO_API_BASE || (isDevelopment 
  ? 'http://localhost:8000/api' 
  : 'https://fociapi.szlg.info/api');

export async function GET() {
  try {
    console.log('🔍 Debug endpoint called');
    console.log('🔍 DJANGO_API_BASE:', DJANGO_API_BASE);
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
    
    // Test connection to Django backend
    let djangoStatus = 'unknown';
    let djangoError = null;
    let announcementsStatus = 'unknown';
    let announcementsError = null;
    let nextjsAnnouncementsStatus = 'unknown';
    let nextjsAnnouncementsError = null;
    let announcementsData = null;
    
    try {
      console.log('🔍 Testing Django connection...');
      const response = await fetch(`${DJANGO_API_BASE}/tournament/current`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
      
      djangoStatus = response.ok ? 'connected' : `error-${response.status}`;
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to read error');
        djangoError = `${response.status} ${response.statusText}: ${errorText}`;
      }
      console.log('🔍 Django response status:', response.status, response.statusText);
    } catch (error) {
      djangoStatus = 'connection-failed';
      djangoError = error instanceof Error ? error.message : String(error);
      console.log('🔍 Django connection failed:', error);
    }
    
    // Test announcements endpoint specifically
    try {
      console.log('🔍 Testing announcements endpoint...');
      const response = await fetch(`${DJANGO_API_BASE}/kozlemenyek/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
      
      announcementsStatus = response.ok ? 'connected' : `error-${response.status}`;
      if (response.ok) {
        announcementsData = await response.json();
      } else {
        const errorText = await response.text().catch(() => 'Unable to read error');
        announcementsError = `${response.status} ${response.statusText}: ${errorText}`;
      }
      console.log('🔍 Announcements response status:', response.status, response.statusText);
    } catch (error) {
      announcementsStatus = 'connection-failed';
      announcementsError = error instanceof Error ? error.message : String(error);
      console.log('🔍 Announcements connection failed:', error);
    }
    
    // Test Next.js API route for announcements
    try {
      console.log('🔍 Testing Next.js announcements API route...');
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : 'https://szlgfoci.vercel.app'; // Adjust this to your actual domain
      
      const response = await fetch(`${baseUrl}/api/announcements`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
      
      nextjsAnnouncementsStatus = response.ok ? 'connected' : `error-${response.status}`;
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to read error');
        nextjsAnnouncementsError = `${response.status} ${response.statusText}: ${errorText}`;
      }
      console.log('🔍 Next.js announcements response status:', response.status, response.statusText);
    } catch (error) {
      nextjsAnnouncementsStatus = 'connection-failed';
      nextjsAnnouncementsError = error instanceof Error ? error.message : String(error);
      console.log('🔍 Next.js announcements connection failed:', error);
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DJANGO_API_BASE,
      },
      django: {
        status: djangoStatus,
        error: djangoError,
        url: `${DJANGO_API_BASE}/tournament/current`
      },
      announcements: {
        status: announcementsStatus,
        error: announcementsError,
        url: `${DJANGO_API_BASE}/kozlemenyek/active`,
        data: announcementsData,
        count: announcementsData ? (Array.isArray(announcementsData) ? announcementsData.length : 1) : 0
      },
      nextjsAnnouncements: {
        status: nextjsAnnouncementsStatus,
        error: nextjsAnnouncementsError
      },
      nextjs: {
        version: process.version,
        status: 'running'
      }
    });
  } catch (error) {
    console.error('🔍 Debug endpoint error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}