import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';

const advantages = [
  'Best Price Guarantee',
  'Handpicked Venues',
  '24/7 Support',
  'Flexible Booking Options',
  'No Hidden Fees',
  'User-Friendly Platform'
];

const WhyBookWithUs: React.FC = () => {
  return (
    <Box mt={8} px={3} py={5} bgcolor="#f5f5f5">
      <Typography variant='h4' sx={{ mb: 4, fontWeight: '600', textAlign: 'center' }}>
        Why book with us?
      </Typography>
      <Grid container spacing={3}>
        {advantages.map((advantage, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box display="flex" alignItems="center" gap={1}>
              <CheckCircleOutline color="primary" />
              <Typography variant="h6" sx={{ fontWeight: '600' }}>
                {advantage}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default WhyBookWithUs;