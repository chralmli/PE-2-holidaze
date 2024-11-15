import React from 'react';
import { Box, Typography, Grid } from '@mui/material'
import BookingCard from './BookingCard';
import { Booking } from '../types/Booking';

interface BookingSectionProps {
  bookings?: Booking[];
  bookingCount: number;
}

const BookingSection: React.FC<BookingSectionProps> = ({ bookings, bookingCount }) => (
  <Box sx={{ marginBottom: '40px' }}>
    <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
      Your upcoming bookings ({bookingCount})
    </Typography>
    {(!bookings || bookings.length === 0) ? (
      <Typography variant="body1" color="text.secondary">You have no bookings yet.</Typography>
    ) : (
      <Grid container spacing={3}>
        {bookings?.map((booking: Booking) => (
          <Grid item key={booking.id}>
            <BookingCard booking={booking} />
          </Grid>
        ))}
      </Grid>
    )}
  </Box>
);

export default BookingSection;
