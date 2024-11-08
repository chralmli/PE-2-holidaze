import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import { getBookingsByUserName } from '../services/bookingService';
import { BookingResponse } from '../types/Booking';
import useUserProfile from '../hooks/useUserProfile';
import BookingCard from '../components/BookingCard';

const UserBookings: React.FC = () => {
  const { profile, loading: profileLoading } = useUserProfile();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!profile) return;

      try {
        setLoading(true);
        const bookingsData: BookingResponse[] = await getBookingsByUserName(profile.name);

        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!profileLoading) {
      fetchBookings();
    }

  }, [profile, profileLoading]);

  if (loading || profileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '20px' }}>
        No upcoming bookings found. Please check back later.
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>Your upcoming bookings</Typography>
      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item key={booking.id}>
            <BookingCard booking={booking} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserBookings;