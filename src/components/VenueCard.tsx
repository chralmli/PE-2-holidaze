import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, CardMedia, Box, IconButton, Menu, MenuItem} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Venue } from '../types/Venue'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StarIcon from '@mui/icons-material/Star';
import dayjs from 'dayjs';

type VenueCardProps = {
    venue: Venue;
    onDelete?: (venueId: string) => void;
    onViewBookings?: (venueId: string) => void;
    onEdit?: (venueId: string) => void;
    isManagerView?: boolean;
};

const VenueCard: React.FC<VenueCardProps> = ({ venue, onDelete, onViewBookings, onEdit, isManagerView = false }) => {
    const defaultImage = 'https://placehold.co/400x200?text=No+Image+Available';

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const navigate = useNavigate();

    const handleViewDetails = () => {
        if (isManagerView) {
            navigate(`/admin/venue/${venue.id}`);
        } else {
            navigate(`/venue/${venue.id}`);
        }
    };

    // check if `venue.media` is defined and has at least one element
    const mediaUrl = venue.media?.length > 0 ? venue.media[0].url : defaultImage;
    const mediaAlt = venue.media && venue.media.length > 0? venue.media[0].alt : 'Placeholder image for venue';

    // get a concise version of the location
    const locationDisplay = `${venue.location.city ?? 'Unknown City'}, ${venue.location.country ?? 'Unknown Country'}`;

    // Owner information
    const ownerName = venue.owner?.name ? venue.owner.name : 'Unknown';

    // Determine the next available booking date
    const getNextAvailableDate = (): string => {
        if (venue.bookings && venue.bookings.length > 0) {
            // sort bookings by dateForm in ascending order
            const sortedBookings = venue.bookings.sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));

            // get the next booking period
            const nextBooking = sortedBookings.find((booking) => dayjs(booking.dateTo).isAfter(dayjs()));

            if (nextBooking) {
                const dateFrom = dayjs(nextBooking.dateFrom).format('DD MMM');
                const dateTo = dayjs(nextBooking.dateTo).format('DD MMM');
                return `${dateFrom} - ${dateTo}`;
            }
        }
        return 'Available now';
    };

    const nextAvailableBooking = getNextAvailableDate();

    return (
        <Card variant="outlined" sx={{ mb: 4, boxShadow: 3, borderRadius: '12px', position: 'relative', transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-5px)'} }}>
            {/* Price banner */}
            <Box sx={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'primary.main', color: 'white', px: 1.5, py: 0.5, borderRadius: '0 12px 0 12px' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {venue.price.toLocaleString('no-NO')} NOK/night
                </Typography>
            </Box>

            {/* Venue image */}
            <CardMedia
                component="img"
                height="200"
                image={mediaUrl}
                alt={mediaAlt}
                sx={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
            />

            <CardContent sx={{ padding: 1 }}>

                {/* Venue name & rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                        {venue.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ color: 'primary.main', fontSize: '1.275rem' }} />
                        <Typography variant="body2" color="text.secondary" fontSize={'1rem'}>
                            {venue.rating?.toFixed(2) ?? 'No rating'}
                        </Typography>
                    </Box>
                </Box>

                {/* Location */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {locationDisplay}
                    </Typography>
                </Box>

                {/* Next available booking */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1}}>
                    {nextAvailableBooking}
                </Typography>

                {/* Venue owner */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Hosted by <b>{ownerName}</b>
                    </Typography>
                </Box>

                {/* Action button and options */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button color="primary" onClick={handleViewDetails} variant="contained">
                        View Details
                    </Button>

                    {/* Conditionally render the action button if callbacks are provided */}
                    {(onDelete || onViewBookings || onEdit) && (
                        <>
                            <IconButton onClick={handleMenuOpen}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{ style: { maxHeight: 200 } }}
                            >
                                {onViewBookings && (
                                    <MenuItem onClick={() => { handleMenuClose(); onViewBookings(venue.id); }}>
                                    View Bookings
                                    </MenuItem>
                                )}
                                {onEdit && (
                                    <MenuItem onClick={() =>{
                                        handleMenuClose();
                                        onEdit(venue.id);
                                    }}>
                                        Edit Venue
                                    </MenuItem>
                                )}
                                {onDelete && (
                                    <MenuItem onClick={() => { handleMenuClose(); onDelete(venue.id); }} sx={{ color: 'error.main' }}>
                                        Delete Venue
                                    </MenuItem>
                                )}
                            </Menu>
                        </>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default VenueCard;