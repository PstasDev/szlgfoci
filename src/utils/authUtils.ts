// Authentication cleanup utilities

export const forceLogout = () => {
  console.log('🧹 Force logout: Clearing all authentication data...');
  
  // Clear localStorage
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('token_timestamp');
  localStorage.removeItem('cookie_consent');
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Try to clear any cookies we can access (though HTTP-only cookies can't be cleared this way)
  document.cookie.split(";").forEach((c) => {
    const eqPos = c.indexOf("=");
    const name = eqPos > -1 ? c.substr(0, eqPos) : c;
    // Clear for current domain
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    // Clear for parent domain
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
    // Clear for parent domain with leading dot
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + window.location.hostname;
  });
  
  console.log('✅ Force logout: All accessible data cleared');
};

export const verifyLogoutComplete = async (apiBaseUrl: string): Promise<boolean> => {
  console.log('🔍 Verifying logout completion...');
  
  try {
    // Try to access a protected endpoint to verify we're logged out
    const response = await fetch(`${apiBaseUrl}/auth/status`, {
      credentials: 'include',
      mode: 'cors'
    });
    
    if (response.ok) {
      const data = await response.json();
      const isAuthenticated = data.authenticated === true;
      console.log('📊 Auth verification result:', { 
        authenticated: isAuthenticated, 
        status: response.status 
      });
      return !isAuthenticated; // Return true if NOT authenticated (logout successful)
    } else {
      console.log('✅ Auth status returned non-OK, logout appears successful');
      return true; // Non-OK response likely means we're logged out
    }
  } catch (error) {
    console.log('✅ Auth status check failed, logout appears successful:', error);
    return true; // Error likely means we're logged out
  }
};

// Debug function to help understand auth state
export const debugAuthState = async () => {
  console.log('🔍 === AUTH DEBUG START ===');
  
  // Check localStorage
  const token = localStorage.getItem('jwt_token');
  const timestamp = localStorage.getItem('token_timestamp');
  console.log('💾 localStorage:', { 
    hasToken: !!token, 
    tokenLength: token?.length || 0,
    timestamp: timestamp 
  });
  
  // Check cookies
  console.log('🍪 All cookies:', document.cookie);
  
  // Check auth status with API
  try {
    const apiBaseUrl = typeof window !== 'undefined' ? 
      (window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : 'https://fociapi.szlg.info/api') :
      'http://localhost:8000/api';
      
    console.log('📡 Checking auth status with API:', apiBaseUrl);
    
    const response = await fetch(`${apiBaseUrl}/auth/status`, {
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log('📊 Auth status response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('📊 Auth status data:', data);
    }
  } catch (error) {
    console.log('❌ Auth status check error:', error);
  }
  
  console.log('🔍 === AUTH DEBUG END ===');
};

// Make debug function available globally for console access
if (typeof window !== 'undefined') {
  (window as any).debugAuthState = debugAuthState;
  (window as any).forceLogout = forceLogout;
}