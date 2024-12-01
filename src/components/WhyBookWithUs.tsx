import React from 'react';
import { Box, Typography, Grid, Container, Paper } from '@mui/material';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DevicesIcon from '@mui/icons-material/Devices';

const advantages = [
  { 
    icon: <PriceCheckIcon />, 
    title: 'Best Price Guarantee',
    description: 'We match any comparable price you find elsewhere' 
  },
  { 
    icon: <VerifiedUserIcon />, 
    title: 'Handpicked Venues',
    description: 'Every venue is personally verified for quality'
  },
  { 
    icon: <SupportAgentIcon />, 
    title: '24/7 Customer Support',
    description: 'Round-the-clock assistance whenever you need it'
  },
  { 
    icon: <CalendarMonthIcon />, 
    title: 'Flexible Booking',
    description: 'Easy modification and cancellation options'
  },
  { 
    icon: <ReceiptLongIcon />, 
    title: 'No Hidden Fees',
    description: 'Transparent pricing with no surprise charges'
  },
  { 
    icon: <DevicesIcon />, 
    title: 'User-Friendly Platform',
    description: 'Easy to use on any device, anywhere'
  },
];

const WhyBookWithUs: React.FC = () => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #34e89e 0%, #0f3443 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%)',
          backgroundSize: '50px 50px',
          opacity: 0.1,
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
          variant='h2'
          gutterBottom
          sx={{ 
            fontWeight: 600, 
            color: 'white',
            mb: 2 
          }}
        >
            Why book with us?
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Discover the Holidaze difference and see why thousands choose us for their stays
          </Typography>
        </Box>

        <Grid container spacing={4}>
        {advantages.map((advantage, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  background: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '& svg': {
                      fontSize: '2rem',
                    }
                  }}
                >
                  {advantage.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    color: 'white',
                  }}
                >
                  {advantage.title}
                </Typography>
              </Box>

              <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.6
                  }}
                >
                  {advantage.description}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
  );
};

export default WhyBookWithUs;