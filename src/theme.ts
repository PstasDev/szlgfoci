'use client';
import { createTheme } from '@mui/material/styles';
import { huHU } from '@mui/material/locale';

// Define SZLG brand colors
const szlgColors = {
  darkGray: '#34393C',
  brown: '#A86D43',
  lightGray: '#5c6166',
  lightBrown: '#c79266',
};

// Define custom colors for the soccer theme
const soccerGreen = {
  50: '#e8f5e8',
  100: '#c8e6c8',
  200: '#a4d4a4',
  300: '#81c784',
  400: '#66bb6a',
  500: '#4caf50',
  600: '#43a047',
  700: '#388e3c',
  800: '#2e7d32',
  900: '#1b5e20',
};

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#34393C', // SZLG blue color
      light: '#5c6166',
      dark: '#1e2124',
      contrastText: '#ffffff',
    },
    secondary: {
      main: szlgColors.brown,
      light: szlgColors.lightBrown,
      dark: '#804d2a',
      contrastText: '#ffffff',
    },
    success: {
      main: soccerGreen[700], // Soccer green for live matches
      light: soccerGreen[500],
      dark: soccerGreen[800],
    },
    warning: {
      main: '#ff9800', // Yellow cards
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#d32f2f', // Red cards
      light: '#f44336',
      dark: '#c62828',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121', // Darker for better contrast
      secondary: '#555555', // Improved contrast
      disabled: '#9e9e9e',
    },
    action: {
      hover: '#f5f5f5',
      selected: '#e3f2fd',
      disabled: '#bdbdbd',
      disabledBackground: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'var(--font-roboto), "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#212121', // High contrast
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#212121', // High contrast
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#212121', // High contrast
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600, // Increased weight for better visibility
      color: '#212121', // Better contrast than SZLG blue
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#212121',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#212121',
    },
    body1: {
      color: '#212121',
      lineHeight: 1.6,
    },
    body2: {
      color: '#424242',
      lineHeight: 1.5,
    },
    caption: {
      color: '#616161',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600, // Increased for better readability
          minHeight: 36, // Better touch target
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.25)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          '& .MuiChip-label': {
            paddingLeft: 8,
            paddingRight: 8,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e0e0e0',
        },
        head: {
          backgroundColor: '#f8f9fa',
          fontWeight: 600,
          color: '#212121',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default gradient
        },
      },
    },
  },
}, huHU); // Hungarian locale

export default theme;
