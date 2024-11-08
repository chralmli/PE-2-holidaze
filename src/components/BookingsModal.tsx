import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, CircularProgress } from '@mui/material';
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

  useEffect(() => {
    const fetchBookings = async () => {
      if (!venueId) return;

      try {
        setLoading(true);
        const venue = await getVenueById(venueId);

        if (venue.bookings) {
          setBookings(venue.bookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      fetchBookings();
    }
  }, [venueId, open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box 
        sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: '600px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4, 
          backgroundColor: 'white', 
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        ) : bookings.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No bookings found for this venue.
          </Typography>
        ) : (
          <Box
            sx={{
              maxHeight: '60vh',
              overflowY: 'auto',
              pr: 2,
            }}
          >
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default BookingsModal;