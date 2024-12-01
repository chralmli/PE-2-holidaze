import React from 'react';
import { Box, Typography, Grid, Skeleton } from '@mui/material'
import BookingCard from './BookingCard';
import { Booking } from '../types/Booking';

interface BookingSectionProps {
  bookings?: Booking[];
  bookingCount: number;
  isLoading?: boolean;
}

const BookingSection: React.FC<BookingSectionProps> = ({ 
  bookings, 
  bookingCount, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Box sx={{ marginBottom: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Your upcoming bookings
        </Typography>
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Skeleton variant="rectangular" height={300} sx={{ BorderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
    </Box>
    );
  }

  return (
    <Box sx={{ marginBottom: 5 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Your upcoming bookings ({bookingCount})
      </Typography>

      {(!bookings || bookings.length === 0) ? (
        <Box 
          sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: 'grey.50',
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" color="textSecondary">
            You have no upcoming bookings.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking: Booking) => (
            <Grid item xs={12} md={6} lg={4} key={booking.id}>
              <BookingCard booking={booking} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BookingSection;
