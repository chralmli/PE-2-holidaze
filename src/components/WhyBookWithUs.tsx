import React from 'react';
import { Box, Typography, SvgIcon, Grid } from '@mui/material';
import { styled } from '@mui/system';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DevicesIcon from '@mui/icons-material/Devices';

const StyledIcon = styled(SvgIcon)({
  fontSize: '3rem',
  color: '#34e89e',
});

const advantages = [
  { icon: <PriceCheckIcon />, text: 'Best Price Guarantee' },
  { icon: <VerifiedUserIcon />, text: 'Handpicked Venues' },
  { icon: <SupportAgentIcon />, text: '24/7 Customer Support' },
  { icon: <CalendarMonthIcon />, text: 'Flexible Booking' },
  { icon: <ReceiptLongIcon />, text: 'No Hidden Fees' },
  { icon: <DevicesIcon />, text: 'User-Friendly Platform' },
];

const WhyBookWithUs: React.FC = () => {
  return (
    <Box 
      mt={8} 
      px={3} 
      py={5} 
      bgcolor="#f5f5f5"
    >
      <Typography variant='h3' sx={{ mb: 4, fontWeight: '500', textAlign: 'center', fontFamily: 'Poppins' }}>
        Why book with us?
      </Typography>
      <Grid container spacing={3}>
        {advantages.map((advantage, index) => (
          <Grid item xs={12} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'left', width: '100%', maxWidth: '300px' }} gap={2}>
              <StyledIcon>{advantage.icon}</StyledIcon>
              <Typography variant="body1" sx={{ fontWeight: '400' }}>
                {advantage.text}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default WhyBookWithUs;