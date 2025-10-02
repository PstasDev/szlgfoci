// Cookie consent utility functions
export interface CookieConsentPreferences {
  necessary: boolean;
  functionality: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

export const getCookieConsent = (): CookieConsentPreferences | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const consent = localStorage.getItem('cookie_consent');
    return consent ? JSON.parse(consent) : null;
  } catch {
    return null;
  }
};

export const isFunctionalityCookiesAllowed = (): boolean => {
  const consent = getCookieConsent();
  return consent?.functionality === true;
};

export const isAnalyticsCookiesAllowed = (): boolean => {
  const consent = getCookieConsent();
  return consent?.analytics === true;
};

export const isMarketingCookiesAllowed = (): boolean => {
  const consent = getCookieConsent();
  return consent?.marketing === true;
};

export const canStoreAuthTokens = (): boolean => {
  // Auth tokens require functionality cookies
  return isFunctionalityCookiesAllowed();
};

export const clearAuthTokensIfNotAllowed = (): void => {
  if (!canStoreAuthTokens()) {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('token_timestamp');
  }
};