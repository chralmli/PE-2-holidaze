import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import dayjs, { Dayjs } from 'dayjs';
import { useAuth } from '../context/AuthContext';
import { createBooking, getBookingsByVenueId } from '../services/bookingService';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/CustomDatePicker.css'

interface BookingFormProps {
  venueId: string;
}

dayjs.extend(isSameOrBefore);

const BookingForm: React.FC<BookingFormProps> = ({ venueId }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [dateFrom, setDateFrom ] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo ] = useState<Dayjs | null>(null);
  const [guests, setGuests ] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());

    // Fetch existing bookings for this venue to disable already booked dates
    useEffect(() => {
      const fetchBookedDates = async () => {
        if (!venueId) return;
  
        try {
          const bookings = await getBookingsByVenueId(venueId);
          console.log('Bookings fetched', bookings);

          const bookedDatesSet = new Set<string>();

          bookings.forEach((booking) => {
            const start = dayjs(booking.dateFrom);
            const end = dayjs(booking.dateTo)

              if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
                console.error('Skipping invalid booking:', booking);
                return;
              }

              let currentDate = start;
              let dayCount = 0;

              // Limit the iteration to avoid infinite loop
              while (currentDate.isSameOrBefore(end) && dayCount < 365) {
                bookedDatesSet.add(currentDate.format('YYYY-MM-DD'));
                currentDate = currentDate.add(1, 'day');
                dayCount++;
              }

              // Prevent infinite loops or too large sets
              if (dayCount >= 365) {
                console.warn('Exceeded 365 days while processing booked dates. Check booking data.');
              }
            });

            console.log('Booked dates set:', bookedDatesSet);
            setBookedDates(bookedDatesSet);
          } catch (error) {
            console.error('Error fetching booked dates:', error);
          }
        };

        fetchBookedDates();
      }, [venueId]);

      const disableDate = useCallback(
        (date: Dayjs) => {
          const formattedDate = date.format('YYYY-MM-DD');
          const isDisabled = bookedDates.has(formattedDate);

          console.log('Checking if date should be disabled:', formattedDate, 'Is date disabled', isDisabled, 'Current booked dates:', Array.from(bookedDates).slice(0, 10));
          return isDisabled;
        },
        [bookedDates]
      );
    

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

    if (dateTo.isBefore(dateFrom)) {
      setErrorMessage('The end date must be after the start date.');
      return;
    }

    // Check if the selected dates overlap with existing bookings
    let currentDate = dateFrom;
    while (currentDate.isSameOrBefore(dateTo)) {
      if (bookedDates.has(currentDate.format('YYYY-MM-DD'))) {
        setErrorMessage('One or more of the selected dates are already booked. Please choose different dates.');
        return;
      }
      currentDate = currentDate.add(1, 'day');
    }

    console.log("Booking Venue ID:", venueId);

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const bookingData = {
        dateFrom: dateFrom.toISOString().split('T')[0],
        dateTo: dateTo.toISOString().split('T')[0],
        guests,
        venueId,
      };

      await createBooking(bookingData);
      setSuccessMessage('Booking created successfully!');
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setErrorMessage('The selected dates are already booked.');
      } else {
        console.error('Error creating booking:', error);
        setErrorMessage('Failed to create booking. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

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
      }}
      >
        <Typography variant="h5">Book this venue</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body1">From:</Typography>
          <DatePicker
            label="Select start date"
            value={dateFrom}
            onChange={(newValue) => {
               setDateFrom(newValue)
               if (dateTo && newValue && dateTo.isBefore(newValue)) {
                setDateTo(null);
               }
            }}
            disablePast
            shouldDisableDate={disableDate}
            slotProps={{
              textField: {
                fullWidth: true,
                helperText: errorMessage,
              },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body1">To:</Typography>
          <DatePicker
            label="Select end date"
            value={dateTo}
            onChange={(newValue) => setDateTo(newValue)}
            disablePast
            minDate={dateFrom || undefined}
            shouldDisableDate={disableDate}
            slotProps={{
              textField: {
                fullWidth: true,
                helperText: errorMessage,
              },
            }}
          />
        </Box>
        <TextField
          label="Number of guests"
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
    </LocalizationProvider>    
  );
};

export default BookingForm;