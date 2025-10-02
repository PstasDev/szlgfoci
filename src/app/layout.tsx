import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import theme from '../theme';
import Footer from '../components/Footer';
import CookieConsentComponent from '../components/CookieConsent';
import { TournamentDataProvider } from '../contexts/TournamentDataContext';
import "./globals.css";
import 'vanilla-cookieconsent/dist/cookieconsent.css';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "Szlgfoci - Iskolai Foci Kupa",
  description: "Kövesd nyomon az iskolai labdarúgó bajnokság eredményeit, csapatokat és játékosokat",
  icons: {
    icon: [
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/favicon.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/favicon-48x48.svg', sizes: '48x48', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon-48x48.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <TournamentDataProvider>
              <Box sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                flexDirection: 'column' 
              }}>
                <Box sx={{ flex: 1 }}>
                  {children}
                </Box>
                <Footer />
              </Box>
              <CookieConsentComponent />
            </TournamentDataProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
