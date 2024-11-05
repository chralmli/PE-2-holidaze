import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/bookingService';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface BookingFormProps {
  venueId: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ venueId }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [dateFrom, setDateFrom ] = useState<string>('');
  const [dateTo, setDateTo ] = useState<string>('');
  const [guests, setGuests ] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleBookingSubmit = async () => {

    // if user is not logged in, redirect them to the login page
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // validate form inputs
    if (!dateFrom || !dateTo || guests <= 0) {
      setErrorMessage('Please fill in all required fields with valid data.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const bookingData = {
        dateFrom,
        dateTo,
        guests,
        venueId,
      };

      await createBooking(venueId, bookingData);
      setSuccessMessage('Booking created successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrorMessage('Failed to create booking. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        marginTop: '20px',
      }}
      >
        <Typography variant="h5">Book this venue</Typography>
        <TextField
          label="From"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <TextField
          label="To"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
        <TextField
          label="Guests"
          type="number"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
        {errorMessage && (
          <Typography color="error">{errorMessage}</Typography>
        )}
        {successMessage && (
          <Typography color="primary">{successMessage}</Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleBookingSubmit}
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Book now'}
        </Button>
      </Box>
  );
};

export default BookingForm;