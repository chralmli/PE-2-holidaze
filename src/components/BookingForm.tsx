import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, TextField, Typography, Alert, Skeleton } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import dayjs, { Dayjs } from 'dayjs';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/bookingService';
import { getVenueById } from '../services/venueService';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/CustomDatePicker.css'

interface BookingFormProps {
  venueId: string;
  maxGuests: number;
}

dayjs.extend(isSameOrBefore);

const BookingForm: React.FC<BookingFormProps> = ({ venueId, maxGuests }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [dateFrom, setDateFrom ] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo ] = useState<Dayjs | null>(null);
  const [guests, setGuests ] = useState<string>('1');

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());

    // Fetch existing bookings for this venue to disable already booked dates
    useEffect(() => {
      const fetchBookedDates = async () => {
        if (!venueId) return;
  
        try {
          setInitialLoading(true);
          const venue = await getVenueById(venueId);

          const bookedDatesSet = new Set<string>();

          venue.bookings?.forEach((booking) => {
            const start = dayjs(booking.dateFrom);
            const end = dayjs(booking.dateTo)

            // Skip invalid bookings without console errors
              if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
                return;
              }

              // Only process future bookings or current bookings
              if (end.isBefore(dayjs(), 'day')) {
                return;
              }

              let currentDate = start;
              for (let i = 0; currentDate.isSameOrBefore(end) && i < 365; i++) {
                bookedDatesSet.add(currentDate.format('YYYY-MM-DD'));
                currentDate = currentDate.add(1, 'day');
              }
            });

            setBookedDates(bookedDatesSet);
          } catch (error) {
            // Only log unexpected errors
            if (error instanceof Error) {
              console.error('Error fetching venue availability:', error.message);
            }
            setErrorMessage('Failed to load availability. Please try again later.');
          } finally {
            setInitialLoading(false);
          }
        };

        fetchBookedDates();
      }, [venueId]);

      const disableDate = useCallback((date: Dayjs) => {
          return bookedDates.has(date.format('YYYY-MM-DD'));
          }, [bookedDates]);

          const validateBooking = (): boolean => {
            if (!isLoggedIn) {
              navigate('/login');
              return false;
            }

            if (!dateFrom || !dateTo) {
              setErrorMessage('Please select both start and end dates.');
              return false;
            }

            const guestsNumber = parseInt(guests, 10);
            if (guestsNumber <= 0 || guestsNumber > maxGuests) {
              setErrorMessage(`Please select between 1 and ${maxGuests} guests.`);
              return false;
            }

            if (dateTo.isBefore(dateFrom)) {
              setErrorMessage('The end date must be after the start date.');
              return false;
            }

            // Check for date conflicts
            let currentDate = dateFrom;
            while (currentDate.isSameOrBefore(dateTo)) {
              if (bookedDates.has(currentDate.format('YYYY-MM-DD'))) {
                setErrorMessage('One or more of the selected dates are already booked. Please choose different dates.');
                return false;
              }
              currentDate = currentDate.add(1, 'day');
            }

            return true;
          };
    

  const handleBookingSubmit = async () => {
    try {
      if (!validateBooking()) return;
      if (!dateFrom || !dateTo) return;

      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await createBooking({
        dateFrom: dateFrom?.format('YYYY-MM-DD'),
        dateTo: dateTo.format('YYYY-MM-DD'),
        guests: parseInt(guests, 10),
        venueId,
      });

      setSuccessMessage('Booking created successfully!');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (error: any) {
      const message = error.response?.status === 409
      ? 'These dates are no longer available.'
      : 'Failed to create booking. Please try again.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ padding: '20px' }}>
        <Skeleton variant="rectangular" height={300} />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        marginTop: '20px',
        backgroundColor: 'background.paper',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05',
      }}
    >
      <Typography variant="h5">Book your stay</Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <DatePicker
            label="Check-in date"
            value={dateFrom}
            onChange={(newValue) => {
               setDateFrom(newValue);
               if (dateTo && newValue && dateTo.isBefore(newValue)) {
                setDateTo(null);
               }
            }}
            disablePast
            shouldDisableDate={disableDate}
            sx={{ flex: 1, minWidth: '200px' }}
          />

          <DatePicker
            label="Check-out date"
            value={dateTo}
            onChange={setDateTo}
            disablePast
            minDate={dateFrom || undefined}
            shouldDisableDate={disableDate}
            sx={{ flex: 1, minWidth: '200px' }}
          />
        </Box>

        <TextField
          label="Number of guests"
          type="number"
          value={guests}
          onChange={(e) => {
            const value = e.target.value;
            setGuests(value);
          }}
          inputProps={{ 
            min: 0, 
            max: maxGuests, 
            onKeyDown: (e) => { 
              if (e.key === 'e' || e.key === '-' || e.key === '+') { 
                e.preventDefault(); 
              }
            } 
          }}
          helperText={`Maximum ${maxGuests} guests allowed`}
          fullWidth
        />

        {errorMessage && (
          <Alert severity="error" onClose={() => setErrorMessage(null)}>
            <Typography color="error">{errorMessage}</Typography>
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" onClose={() => setSuccessMessage(null)}>
            <Typography color="primary">{successMessage}</Typography>
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleBookingSubmit}
          disabled={loading}
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #34e89e, #0f3443)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0f3443, #34e89e)',
            },
          }}
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </Button>
      </Box>
    </LocalizationProvider>    
  );
};

export default BookingForm;