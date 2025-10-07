// Authentication Test Script
// This can be run in the browser console to test JWT token auth

console.log('🔍 Testing JWT Authentication...');

// Check if JWT token exists
const token = localStorage.getItem('jwt_token');
console.log('🔑 JWT Token status:', {
  exists: !!token,
  length: token?.length || 0,
  preview: token ? `${token.substring(0, 20)}...` : null
});

// Check token timestamp
const timestamp = localStorage.getItem('token_timestamp');
console.log('⏰ Token timestamp:', timestamp);

// Check if token is expired (if timestamp exists)
if (timestamp) {
  const tokenTime = new Date(timestamp);
  const now = new Date();
  const diffHours = (now.getTime() - tokenTime.getTime()) / (1000 * 60 * 60);
  console.log('📅 Token age:', `${diffHours.toFixed(2)} hours`);
  
  if (diffHours > 24) {
    console.log('⚠️ Token may be expired (older than 24 hours)');
  }
}

// Test API call with current token
async function testAuthentication() {
  try {
    console.log('🚀 Testing API call...');
    
    const apiUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:8000/api' 
      : 'https://fociapi.szlg.info/api';
    
    // Test auth status endpoint
    const response = await fetch(`${apiUrl}/auth/status`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log('📊 Auth test response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Auth test data:', data);
      return data;
    } else {
      const errorText = await response.text();
      console.log('❌ Auth test failed:', errorText);
      return null;
    }
  } catch (error) {
    console.error('💥 Auth test error:', error);
    return null;
  }
}

// Run the test
testAuthentication();

export {};