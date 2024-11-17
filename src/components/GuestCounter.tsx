import React from 'react';
import { Box, Typography, IconButton, Popover } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface GuestCounterProps {
  guests: number;
  setGuests: React.Dispatch<React.SetStateAction<number>>;
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

const GuestCounter: React.FC<GuestCounterProps> = ({ guests, setGuests, anchorEl, setAnchorEl }) => {
  const handleGuestsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleGuestsClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'guests-popover' : undefined;

  return (
    <>
      <Box
        onClick={handleGuestsClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          backgroundColor: '#ffffff',
          borderRadius: '50px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          border: '1px solid #34e89e',
          height: ' 56px',
          marginRight: '8px',
        }}
      >
        <Typography 
          variant="body1" 
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{
            fontWeight: 'bold',
            color: '#333',
            userSelect: 'none',
          }}
        >
          {guests} guest{guests > 1 ? 's' : ''}
        </Typography>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleGuestsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{
          '.MuiPopover-paper': {
            padding: '16px',
            borderRadius: '12px',
          },
        }}
      >
        <Box p={2} display="flex" alignItems="center" justifyContent="space-between" width="200px">
          <IconButton 
            onClick={() => setGuests(Math.max(1, guests - 1))}
            sx={{ backgroundColor: '#f0f0f0', '&:hover': { backgroundColor: '#e0e0e0' } }}
          >
            <RemoveIcon />
          </IconButton>
          <Typography variant="h6" sx={{margin: '0 16px', fontWeight: 'bold' }}>{guests}</Typography>
          <IconButton onClick={() => setGuests(guests + 1)}
            sx={{ backgroundColor: '#f0f0f0', '&:hover': { backgroundColor: '#e0e0e0' } }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Popover>
    </>
  );
};

export default GuestCounter;