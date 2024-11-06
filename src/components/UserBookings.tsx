import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { getBookingsByUserName, updateBooking, deleteBooking } from '../services/bookingService';
import { Booking, BookingResponse } from '../types/Booking';
import useUserProfile from '../hooks/useUserProfile';

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

  const handleUpdateBooking = async (bookingId: string) => {
    const newDateFrom = prompt("Enter new start date (YYYY-MM-DD):");
    const newDateTo = prompt("Enter new end date (YYYY-MM-DD):");
    if (!newDateFrom || !newDateTo) {
      return;
    }

    try {
      const updatedBooking = await updateBooking(bookingId, {
        dateFrom: newDateFrom,
        dateTo: newDateTo,
      });
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to delete this booking')) {
      try {
        await deleteBooking(bookingId);
        setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      } catch (error) {
        console.error('Error deleting booking:',  error);
      }
    }
  };

  if (loading) {
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
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>Your upcoming bookings</Typography>
      {bookings.map((booking) => (
        <Box key={booking.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
          <Typography variant="h6">Venue: {booking.venue?.name || 'N/A'}</Typography>
          <Typography>Guests: {booking.guests}</Typography>
          <Typography>From: {booking.dateFrom}</Typography>
          <Typography>To: {booking.dateTo}</Typography>

          <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleUpdateBooking(booking.id)}
            >
              Update Booking
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDeleteBooking(booking.id)}
            >
              Delete Booking
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default UserBookings;