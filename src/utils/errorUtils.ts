// Error handling utilities with user-friendly messages

export interface ErrorInfo {
  title: string;
  message: string;
  action?: string;
  actionHref?: string;
}

export const getErrorInfo = (context: string, error?: Error | { message?: string; status?: number; response?: { status?: number } }): ErrorInfo => {
  // Check if it's a 404 error or related to not found
  const is404 = error?.message?.includes('404') || 
                (error as { status?: number })?.status === 404 || 
                error?.message?.includes('Not Found') ||
                (error as { response?: { status?: number } })?.response?.status === 404;

  switch (context) {
    case 'tournaments':
      if (is404) {
        return {
          title: 'Nincsenek elérhető bajnokságok',
          message: 'Jelenleg nincsenek nyilvános bajnokságok. Próbáld meg később.',
          action: 'Vissza a főoldalra',
          actionHref: '/'
        };
      }
      return {
        title: 'Hiba a bajnokságok betöltésekor',
        message: 'Nem sikerült betölteni a bajnokságokat. Ellenőrizd az internetkapcsolatot.',
        action: 'Újrapróbálás',
        actionHref: typeof window !== 'undefined' ? window.location.href : '/'
      };

    case 'matches':
      if (is404) {
        return {
          title: 'Még nincsenek meccsek',
          message: 'Ebben a bajnokságban még nem lettek meccsek meghirdetve. Látogass vissza később!',
          action: 'Vissza a főoldalra',
          actionHref: '/'
        };
      }
      return {
        title: 'Hiba a meccsek betöltésekor',
        message: 'Nem sikerült betölteni a meccseket. Próbáld meg újra.',
        action: 'Újrapróbálás',
        actionHref: typeof window !== 'undefined' ? window.location.href : '/'
      };

    case 'teams':
      if (is404) {
        return {
          title: 'A csapatok még nem nyilvánosak',
          message: 'A csapatok adatai még nem érhetők el nyilvánosan. Várj a bajnokság kezdetéig!',
          action: 'Vissza a főoldalra',
          actionHref: '/'
        };
      }
      return {
        title: 'Hiba a csapatok betöltésekor',
        message: 'Nem sikerült betölteni a csapatok adatait. Próbáld meg újra.',
        action: 'Újrapróbálás',
        actionHref: typeof window !== 'undefined' ? window.location.href : '/'
      };

    case 'team':
      if (is404) {
        return {
          title: 'Csapat nem található',
          message: 'Ez a csapat nem létezik, vagy még nem érhető el nyilvánosan.',
          action: 'Vissza a csapatokhoz',
          actionHref: '/csapatok'
        };
      }
      return {
        title: 'Hiba a csapat betöltésekor',
        message: 'Nem sikerült betölteni a csapat adatait. Próbáld meg újra.',
        action: 'Vissza a csapatokhoz',
        actionHref: '/csapatok'
      };

    case 'players':
      if (is404) {
        return {
          title: 'Játékosok még nem elérhetők',
          message: 'A játékosok adatai még nem kerültek nyilvánosságra. Várj a bajnokság kezdetéig!',
          action: 'Vissza a főoldalra',
          actionHref: '/'
        };
      }
      return {
        title: 'Hiba a játékosok betöltésekor',
        message: 'Nem sikerült betölteni a játékosok adatait. Próbáld meg újra.',
        action: 'Újrapróbálás',
        actionHref: typeof window !== 'undefined' ? window.location.href : '/'
      };

    case 'player':
      if (is404) {
        return {
          title: 'Játékos nem található',
          message: 'Ez a játékos nem létezik, vagy még nem érhető el nyilvánosan.',
          action: 'Vissza a játékosokhoz',
          actionHref: '/jatekosok'
        };
      }
      return {
        title: 'Hiba a játékos betöltésekor',
        message: 'Nem sikerült betölteni a játékos adatait. Próbáld meg újra.',
        action: 'Vissza a játékosokhoz',
        actionHref: '/jatekosok'
      };

    case 'match':
      if (is404) {
        return {
          title: 'Meccs nem található',
          message: 'Ez a meccs nem létezik, vagy még nem érhető el nyilvánosan.',
          action: 'Vissza a meccsekhez',
          actionHref: '/merkozesek'
        };
      }
      return {
        title: 'Hiba a meccs betöltésekor',
        message: 'Nem sikerült betölteni a meccs adatait. Próbáld meg újra.',
        action: 'Vissza a meccsekhez',
        actionHref: '/merkozesek'
      };

    case 'standings':
      if (is404) {
        return {
          title: 'Tabella még nem elérhető',
          message: 'A bajnoki tabella még nem került kialakításra. Várj az első meccsek lejátszásáig!',
          action: 'Vissza a főoldalra',
          actionHref: '/'
        };
      }
      return {
        title: 'Hiba a tabella betöltésekor',
        message: 'Nem sikerült betölteni a bajnoki tabellát. Próbáld meg újra.',
        action: 'Újrapróbálás',
        actionHref: typeof window !== 'undefined' ? window.location.href : '/'
      };

    case 'goalscorers':
      if (is404) {
        return {
          title: 'Góllisták még nem elérhetők',
          message: 'A góllövőlisták még nem kerültek kialakításra. Várj az első gólokig!',
          action: 'Vissza a főoldalra',
          actionHref: '/'
        };
      }
      return {
        title: 'Hiba a góllista betöltésekor',
        message: 'Nem sikerült betölteni a góllövőlistát. Próbáld meg újra.',
        action: 'Újrapróbálás',
        actionHref: typeof window !== 'undefined' ? window.location.href : '/'
      };

    default:
      if (is404) {
        return {
          title: 'Tartalom nem található',
          message: 'A keresett tartalom jelenleg nem elérhető.',
          action: 'Vissza a főoldalra',
          actionHref: '/'
        };
      }
      return {
        title: 'Hiba történt',
        message: 'Valami hiba történt. Próbáld meg újra.',
        action: 'Újrapróbálás',
        actionHref: typeof window !== 'undefined' ? window.location.href : '/'
      };
  }
};

// Function to check if error is 404
export const is404Error = (error: Error | { message?: string; status?: number; response?: { status?: number } }): boolean => {
  return error?.message?.includes('404') || 
         (error as { status?: number })?.status === 404 || 
         error?.message?.includes('Not Found') ||
         (error as { response?: { status?: number } })?.response?.status === 404;
};

// Function to check if data is empty (could indicate 404 or no data)
export const isEmptyDataError = (data: unknown[]): boolean => {
  return Array.isArray(data) && data.length === 0;
};
