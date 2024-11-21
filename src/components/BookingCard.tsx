import React from 'react';
import { Card, CardContent, Typography, Box, CardMedia, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Booking } from '../types/Booking';
import { Group, Event, LocationOn } from '@mui/icons-material';
import dayjs from 'dayjs';

type BookingCardProps = {
    booking: Booking;
    showBookingId?: boolean;
};

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    position: 'relative',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)',
    },
}));

const BookingIdBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: '6px 12px',
    zIndex: 1,
    borderRadius: '0 12px 0 12px',
}));

const InfoRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    gap: '8px',
}));

const BookingCard: React.FC<BookingCardProps> = ({ booking, showBookingId = false }) => {
    const defaultImage = "/api/placeholder/400/200";
    const imageUrl = booking.venue?.media?.[0]?.url || defaultImage;
    const imageAlt = booking.venue?.media?.[0]?.alt || 'Venue image';

    const formatDate = (date: string) => dayjs(date).format('DD MMM YYYY');

    return (
        <StyledCard variant="outlined">
            {showBookingId && (
                <BookingIdBadge>
                    <Typography variant="caption" fontWeight="medium">
                        ID: {booking.id.slice(0, 8)}
                    </Typography>
                </BookingIdBadge>
            )}

            {/* Venue image */}
            <CardMedia
                component="img"
                height="200"
                image={imageUrl}
                alt={imageAlt}
                sx={{ objectFit: 'cover' }}
            />

            <CardContent sx={{ padding: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {booking.venue?.name || 'Venue not available'}
                </Typography>

                {booking.venue?.location && (
                    <InfoRow sx={{ mb: 2 }}>
                        <LocationOn color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {booking.venue.location.city}, {booking.venue.location.country}
                        </Typography>
                    </InfoRow>
                )}

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip
                        icon={<Group />}
                        label={`${booking.guests} guests`}
                        variant="outlined"
                        size='small'
                    />
                    <Chip
                        icon={<Event />}
                        label={`${formatDate(booking.dateFrom)} - ${formatDate(booking.dateTo)}`}
                        variant="outlined"
                        size='small'
                    />
                </Box>

                {booking.created && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                        Booked on: {formatDate(booking.created)}
                    </Typography>
                )}
            </CardContent>
        </StyledCard>
    );
};

export default BookingCard;