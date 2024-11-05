import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBookingsByUserId } from '../services/bookingService';
import { Booking, BookingResponse } from '../types/Booking';
import { Box, Typography, CircularProgress } from '@mui/material';

const UserBookings: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isLoggedIn && user) {
      const fetchBookings = async () => {
        try {
          setLoading(true);
          const bookingsData: BookingResponse[] = await getBookingsByUserId(user.name);

          // Transform BookingResponse to Booking
          const transformedBookings = bookingsData.map(booking => ({
            id: booking.id,
            dateFrom: booking.dateFrom,
            dateTo: booking.dateTo,
            guests: booking.guests,
            created: booking.created,
            updated: booking.updated,
            venue: booking.venue,
            customer: booking.customer,
          }));

          setBookings(transformedBookings);
        } catch (error) {
          console.error('Error fetching bookings:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    }
  }, [isLoggedIn, user]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Your Bookings
      </Typography>
      {bookings.length === 0 ? (
        <Typography>No bookings found.</Typography>
      ) : (
        bookings.map((booking) => (
          <Box key={booking.id} sx={{ mb: 2, border: '1px solid #e0e0e0', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">{booking.venue?.name || 'Venue'}</Typography>
            <Typography>Guests: {booking.guests}</Typography>
            <Typography>From: {booking.dateFrom}</Typography>
            <Typography>To: {booking.dateTo}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

export default UserBookings;