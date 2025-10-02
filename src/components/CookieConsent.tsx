'use client';

import React, { useEffect } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';

// Type definitions for cookie consent
interface CookieConsentData {
  categories: string[];
  level: string[];
  revision: number;
  data?: any;
}

interface CookieChangeData {
  cookie: CookieConsentData;
  changedCategories: string[];
}

// Extend the CookieConsent module with proper types
declare module 'vanilla-cookieconsent' {
  export function onConsent(callback: (data: { cookie: CookieConsentData }) => void): void;
  export function onChange(callback: (data: CookieChangeData) => void): void;
}

const CookieConsentComponent: React.FC = () => {
  useEffect(() => {
    // Initialize cookie consent
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: 'box inline',
          position: 'bottom right',
          equalWeightButtons: true,
          flipButtons: false
        },
        preferencesModal: {
          layout: 'box',
          position: 'right',
          equalWeightButtons: true,
          flipButtons: false
        }
      },
      categories: {
        necessary: {
          readOnly: true
        },
        functionality: {},
        analytics: {},
        marketing: {}
      },
      language: {
        default: 'hu',
        autoDetect: 'browser',
        translations: {
          hu: {
            consentModal: {
              title: 'Cookie-k használata',
              description: 'Ez a weboldal cookie-kat használ a funkcionalitás biztosítása és a felhasználói élmény javítása érdekében.',
              acceptAllBtn: 'Összes elfogadása',
              acceptNecessaryBtn: 'Csak szükséges',
              showPreferencesBtn: 'Beállítások kezelése',
            },
            preferencesModal: {
              title: 'Cookie beállítások',
              acceptAllBtn: 'Összes elfogadása',
              acceptNecessaryBtn: 'Csak szükséges',
              savePreferencesBtn: 'Beállítások mentése',
              closeIconLabel: 'Bezárás',
              serviceCounterLabel: 'Szolgáltatás|Szolgáltatások',
              sections: [
                {
                  title: 'Cookie használat',
                  description: 'Ez a weboldal cookie-kat használ a megfelelő működés biztosításához és a felhasználói élmény javításához.'
                },
                {
                  title: 'Szükséges cookie-k <span class="pm__badge">Mindig aktív</span>',
                  description: 'Ezek a cookie-k elengedhetetlenek a weboldal megfelelő működéséhez. Nem kapcsolhatók ki.',
                  linkedCategory: 'necessary',
                    cookieTable: {
                    headers: {
                      name: 'Cookie név',
                      domain: 'Domain',
                      description: 'Leírás',
                      expiration: 'Lejárat'
                    },
                    body: [
                        {
                            name:"cc_cookie",
                            domain:"foci.szlg.info",
                            description:"A cookie elfogadásának állapotát tárolja",
                            expiration:"6 hónap"
                        },
                        {
                            name:"jwt_token",
                            domain:"foci.szlg.info",
                            description:"A bejelentkezési token tárolása",
                            expiration:"1 óra"
                        }
                    ]
                  }
                },
                {
                  title: 'További információk',
                  description: 'Bármilyen kérdés esetén kapcsolatba léphet velünk az <a class="cc__link" href="mailto:balla.botond.23f@szlgbp.hu">balla.botond.23f@szlgbp.hu</a> címen.'
                }
              ]
            }
          },
          en: {
            consentModal: {
              title: 'We use cookies!',
              description: 'This website uses cookies to ensure functionality and improve user experience.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage preferences',
              footer: '<a href="/szabalyzat">Privacy Policy</a>'
            },
            preferencesModal: {
              title: 'Cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all', 
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close modal',
              serviceCounterLabel: 'Service|Services',
              sections: [
                {
                  title: 'Cookie usage',
                  description: 'This website uses cookies to ensure proper functionality and improve user experience.'
                },
                {
                    title: 'Necessary cookies <span class="pm__badge">Always active</span>',
                    description: 'These cookies are essential for the website to function properly. They cannot be disabled.',
                    linkedCategory: 'necessary',
                    cookieTable: {
                    headers: {
                        name: 'Cookie name',
                        domain: 'Domain',
                        description: 'Description',
                        expiration: 'Expiration'
                    },
                    body: [
                        {
                            name:"cc_cookie",
                            domain:"foci.szlg.info",
                            description:"Stores the cookie acceptance state",
                            expiration:"6 months"
                        },
                        {
                            name:"jwt_token",
                            domain:"foci.szlg.info",
                            description:"Stores the login token",
                            expiration:"1 hour"
                        }
                    ]
                  }
                },
                {
                  title: 'More information',
                  description: 'For any questions, contact us at <a class="cc__link" href="mailto:balla.botond.23f@szlgbp.hu">balla.botond.23f@szlgbp.hu</a>.'
                }
              ]
            }
          }
        }
      }
    });

    // Handle cookie consent changes with proper error handling
    try {
      if (typeof (CookieConsent as any).onConsent === 'function') {
        (CookieConsent as any).onConsent(({ cookie }: { cookie: CookieConsentData }) => {
          console.log('Cookie consent given:', cookie);
          
          // Since your config only has necessary cookies, set functionality to true by default
          // when user accepts cookies (necessary cookies are always true)
          localStorage.setItem('cookie_consent', JSON.stringify({
            necessary: true,
            functionality: true, // Allow functionality since JWT tokens are in necessary category
            analytics: cookie.categories.includes('analytics'),
            marketing: cookie.categories.includes('marketing'),
            timestamp: Date.now()
          }));
        });
      }

      if (typeof (CookieConsent as any).onChange === 'function') {
        (CookieConsent as any).onChange(({ cookie, changedCategories }: CookieChangeData) => {
          console.log('Cookie consent changed:', cookie, changedCategories);
          
          // Since your config only has necessary cookies, set functionality to true by default
          localStorage.setItem('cookie_consent', JSON.stringify({
            necessary: true,
            functionality: true, // Allow functionality since JWT tokens are in necessary category
            analytics: cookie.categories.includes('analytics'),
            marketing: cookie.categories.includes('marketing'),
            timestamp: Date.now()
          }));

          // Since JWT tokens are now in necessary category, they shouldn't be cleared
          // But we'll keep this logic in case you add back functionality category
          if (changedCategories.includes('functionality') && !cookie.categories.includes('functionality')) {
            console.log('Functionality cookies disabled, clearing auth tokens');
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('token_timestamp');
            
            // Redirect to login if on protected page
            if (window.location.pathname.includes('/elo-jegyzokonyv')) {
              window.location.href = '/elo-jegyzokonyv';
            }
          }
        });
      }
    } catch (error) {
      console.log('Cookie consent event handlers not available:', error);
    }

    // Cleanup function
    return () => {
      // Reset cookie consent if needed
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default CookieConsentComponent;