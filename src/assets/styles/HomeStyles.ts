import { styled } from '@mui/material/styles';
import { Box, Button, TextField } from '@mui/material';

export const StyledBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #34e89e, #0f3443)',
  padding: theme.spacing(2),
  boxSizing: 'border-box',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

export const SearchBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '50%',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    width: '100%',
  },
}));

export const SearchWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: 0,
  },
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

export const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: 1200,
  borderRadius: theme.spacing(6),
  backgroundColor: '#ffffff',
  padding: theme.spacing(1),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  marginTop: theme.spacing(2),
  border: '3px solid #34e89e',
  gap: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    borderRadius: theme.spacing(3),
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  width: '70%',
  '& .MuiOutlinedInput-root': {
    height: '48px',
    borderRadius: theme.spacing(6),
    backgroundColor: '#ffffff',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'transparent',
    },
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    borderBottom: '1px solid rgba(0,0,0, 0.12)',
  },
}));

export const SearchButtonWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export const SearchButton = styled(Button)(({ theme }) => ({
  height: '48px',
  minWidth: 100,
  borderRadius: theme.spacing(6),
  padding: theme.spacing(1, 3),
  color: '#ffffff',
  fontSize: 16,
  background: 'linear-gradient(135deg, #34e89e, #0f3443)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #0f3443, #34e89e)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));


export const DatePickerWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flex: 2,
  '& .MuiTextField-root': {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      height: '48px',
      BorderRadius: theme.spacing(6),
      '& fieldset': {
        borderColor: 'transparent',
      },
    },
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: theme.spacing(2),
  },
}));

export const GuestCounterWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: theme.spacing(2),
  },
}));