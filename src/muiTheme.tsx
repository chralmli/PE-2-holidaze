import { createTheme } from '@mui/material/styles';

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        gradient: true;
    }
}

const muiTheme = createTheme({
    palette: {
        primary: {
            main: '#0f3443',
        },
        secondary: {
            main: '#34e89e',
        },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
        h1: {
            fontSize: '2rem',
            fontWeight: 'bold',
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 'bold',
        },
        h4: {
            fontSize: '1rem',
            fontWeight: 'bold',
        },
        h5: {
            fontSize: '0.875rem',
            fontWeight: 'bold',
        },
        h6: {
            fontSize: '0.75rem',
            fontWeight: 'bold',
        },
    },
    components: {
        MuiButton: {
            variants: [
                {
                    props: { variant: 'contained', color: 'gradient' },
                    style: {
                        background: 'linear-gradient(135deg, #34e89e, #0f3443)',
                        transition: 'background 0.3s ease, color 0.2s ease, box-shadow 0.4s ease !important',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #0f3443, #34e89e)',
                        },
                    },
                },
            ],
        },
    },
});

export default muiTheme;