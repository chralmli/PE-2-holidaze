import React from 'react';
import { Card, CardContent, Typography, Box, CardMedia } from '@mui/material';
import { Booking } from '../types/Booking';
import { Group, Event } from '@mui/icons-material';

type BookingCardProps = {
    booking: Booking;
    showBookingId?: boolean;
};

const BookingCard: React.FC<BookingCardProps> = ({ booking, showBookingId = false }) => {
    const defaultImage = "https://placehold.co/200?text=Image+Not+Available"; // Placeholder image URL

    // Access the media URL or fall back to defaultImage
    const imageUrl = booking.venue?.media?.[0]?.url || defaultImage;
    const imageAlt = booking.venue?.media?.[0]?.alt || 'Placeholder image for venue';

    return (
        <Card variant="outlined" sx={{ mb: 2, boxShadow: 2, borderRadius: '10px' }}>
            {/* Venue image */}
            <CardMedia
                component="img"
                height="200"
                image={imageUrl}
                alt={imageAlt}
            />
            <CardContent sx={{ padding: '16px' }}>
                {showBookingId && (
                    <Typography variant="h6" color="text-secondary" sx={{ mb: 1 }}>
                        Booking ID: {booking.id}
                    </Typography>
                )}
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {booking.venue?.name || 'Venue name not available'}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Group sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="body1">
                        Number of Guests: {booking.guests}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Event sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="body1">
                        From: {new Date(booking.dateFrom).toLocaleDateString()}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Event sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="body1">
                        To: {new Date(booking.dateTo).toLocaleDateString()}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default BookingCard;