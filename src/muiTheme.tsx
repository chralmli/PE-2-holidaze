import { createTheme, alpha } from '@mui/material/styles';

// Add custom variants
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    gradient: true;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }
}

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f3443',
      light: '#345E70',
      dark: '#092330',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#34e89e',
      light: '#5CECB1',
      dark: '#24A26E',
      contrastText: '#0F3443',
    },
    neutral: {
      main: '#64748B',
      light: '#94A3B8',
      dark: '#334155',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    error: {
      main: '#FF5252',
    },
    warning: {
      main: '#FFB74D',
    },
    info: {
      main: '#64B5F6',
    },
    success: {
      main: '#4CAF50',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0.01em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
          boxShadow: 'none',
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          lineHeight: 1.5,
          minWidth: 100,
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(15, 52, 67, 0.12)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'gradient' },
          style: {
            background: 'linear-gradient(135deg, #34e89e 0%, #0f3443 100%)',
            color: '#FFFFFF',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #0f3443 0%, #34e89e 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(52, 232, 158, 0.25)',
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0px 2px 4px rgba(15, 52, 67, 0.05)',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(15, 52, 67, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha('#0f3443', 0.3),
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backdropFilter: 'blur(8px)',
          backgroundColor: alpha('#FFFFFF', 0.8),
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(15, 52, 67, 0.05)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(15, 52, 67, 0.1)',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(15, 52, 67, 0.05)',
    '0px 4px 8px rgba(15, 52, 67, 0.08)',
    '0px 8px 16px rgba(15, 52, 67, 0.1)',
    '0px 12px 24px rgba(15, 52, 67, 0.12)',
    '0px 16px 32px rgba(15, 52, 67, 0.14)',
    '0px 20px 40px rgba(15, 52, 67, 0.16)',
    '0px 24px 48px rgba(15, 52, 67, 0.18)',
    '0px 32px 64px rgba(15, 52, 67, 0.2)',
    '0px 40px 80px rgba(15, 52, 67, 0.22)',
    '0px 48px 96px rgba(15, 52, 67, 0.24)',
    '0px 56px 128px rgba(15, 52, 67, 0.26)',
    '0px 64px 160px rgba(15, 52, 67, 0.28)',
    '0px 72px 192px rgba(15, 52, 67, 0.3)',
    '0px 80px 224px rgba(15, 52, 67, 0.32)',
    '0px 88px 256px rgba(15, 52, 67, 0.34)',
    '0px 96px 288px rgba(15, 52, 67, 0.36)',
    '0px 104px 320px rgba(15, 52, 67, 0.38)',
    '0px 112px 352px rgba(15, 52, 67, 0.4)',
    '0px 120px 384px rgba(15, 52, 67, 0.42)',
    '0px 128px 416px rgba(15, 52, 67, 0.44)',
    '0px 136px 448px rgba(15, 52, 67, 0.46)',
    '0px 144px 480px rgba(15, 52, 67, 0.48)',
    '0px 152px 512px rgba(15, 52, 67, 0.5)',
    '0px 160px 544px rgba(15, 52, 67, 0.52)',
  ],
});

export default muiTheme;