import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Booking } from '../types/Booking';

type BookingCardProps = {
    booking: Booking;
};

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    Booking ID: {booking.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Guests: {booking.guests}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    From: {new Date(booking.dateFrom).toLocaleDateString()} - To: {new Date(booking.dateTo).toLocaleDateString()}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default BookingCard;