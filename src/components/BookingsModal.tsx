import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, CircularProgress, IconButton, Divider, Alert } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { getVenueById } from '../services/venueService';
import { BookingResponse } from '../types/Booking';
import BookingCard from './BookingCard';

type BookingsModalProps = {
  venueId: string;
  open: boolean;
  onClose: () => void;
};

const BookingsModal: React.FC<BookingsModalProps> = ({ venueId, open, onClose }) => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!venueId || !open) return;

      try {
        setLoading(true);
        setError(null);
        const venue = await getVenueById(venueId);

        if (venue?.bookings) {
          // Sort bookings by date
          const sortedBookings = [...venue.bookings].sort((a, b) =>
            new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
          );
          setBookings(sortedBookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Error fetching bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [venueId, open]);

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      aria-labelledby="bookings-modal-title"
    >
      <Box 
        sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '700px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: '12px',
          outline: 'none',
        }}
      >
        {/* Header */}
        <Box sx={{
          p: 3,
          display: 'flex',
          justifyContent:'space-between',
          alignItems: 'center',
        }}>
          <Typography id="bookings-modal-title" variant="h5" fontWeight="bold">
            Venue Bookings
          </Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Content */}
        <Box sx={{ p: 3, maxHeight: '70vh', overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : bookings.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No bookings found for this venue.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default BookingsModal;