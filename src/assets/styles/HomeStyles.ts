import { styled } from '@mui/material/styles';
import { Box, Button, TextField } from '@mui/material';
import { BorderRight, Widgets } from '@mui/icons-material';

export const StyledBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #34e89e, #0f3443)',
  padding: '20px',
  boxSizing: 'border-box',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: '20px',
}));

export const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: 1200,
  borderRadius: '50px',
  backgroundColor: '#ffffff',
  padding: '6px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  marginTop: '20px',
  border: '3px solid #34e89e',
  position: 'relative',
  gap: '8px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
    borderRadius: 25,
  },
}));

export const SearchButton = styled(Button)(({ theme }) => ({
  minWidth: 100,
  borderRadius: 50,
  padding: '14px',
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

export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginRight: theme.spacing(2),
  backgroundColor: '#ffffff',
  flex: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: '50px',
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
    marginRight: 0,
  },
}));

export const DatePickerWrapper = styled(Box)(({ theme }) => ({
  marginRight: '8px',
  flex: 1,
  '& .MuiTextField-root': {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      height: '48px',
      BorderRadius: '50px',
      '& fieldset': {
        borderColor: 'transparent',
      },
    },
  },
  [theme.breakpoints.down('md')]: {
    marginRight: 0,
    width: '100%',
  },
}));