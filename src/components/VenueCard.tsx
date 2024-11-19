import React, { useState, useMemo } from 'react';
import { Card, CardContent, Typography, Button, CardMedia, Box, IconButton, Menu, MenuItem, Chip, Skeleton, styled} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Venue } from '../types/Venue'
import {
    MoreVert as MoreVertIcon,
    Star as StarIcon,
    Wifi as WifiIcon,
    LocalParking as LocalParkingIcon,
    Restaurant as BreakfastIcon,
    Pets as PetsIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

type VenueCardProps = {
    venue: Venue;
    onDelete?: (venueId: string) => void;
    onViewBookings?: (venueId: string) => void;
    onEdit?: (venueId: string) => void;
    isManagerView?: boolean;
    isLoading?: boolean;
};

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    position: 'relative',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)',
    },
}));

const PriceBanner = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: '6px 12px',
    zIndex: 1,
    borderRadius: '0 12px 0 12px',
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #34e89e, #0f3443)',
    color: '#fff',
    textTransform: 'capitalize',
    padding: '8px 24px',
    '&:hover': {
        background: 'linear-gradient(135deg, #0f3443, #34e89e)',
    },
}));

const AmenityIcon = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: 'rgba(0,0,0,0.6)',
});

const VenueCard: React.FC<VenueCardProps> = ({ venue, onDelete, onViewBookings, onEdit, isManagerView = false, isLoading = false }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const defaultImage = 'https://placehold.co/400x200?text=No+Image+Available';
    const mediaUrl = useMemo(() => {
        if (!venue.media?.length || !venue.media[0]?.url || venue.media[0].url === 'string') {
            return defaultImage;
        }
        return venue.media[0].url;
    }, [venue.media]);

    const locationDisplay = useMemo(() => {
        const city = venue.location?.city || 'Unknown City';
        const country = venue.location?.country || 'Unknown Country';
        return `${city}, ${country}`;
    }, [venue.location]);

    const nextAvailableDate = useMemo(() => {
        if (!venue.bookings?.length) return 'Available now';

        const sortedBookings = [...venue.bookings]
            .sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)))
            .find(booking => dayjs(booking.dateTo).isAfter(dayjs()));
            
        if (!sortedBookings) return 'Available now';

        return `${dayjs(sortedBookings.dateFrom).format('DD MMM')} - ${dayjs(sortedBookings.dateTo).format('DD MMM')}`;
    }, [venue.bookings]);


    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleViewDetails = () => navigate(`/${isManagerView ? 'admin/venue/': 'venue/'}${venue.id}`);

    if (isLoading) {
        return (
            <StyledCard>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="30%" />
                    <Box sx={{ mt: 2 }}>
                        <Skeleton variant="rectangular" width={120} height={36} />
                    </Box>
                </CardContent>
            </StyledCard>
        );
    }

    return (
        <StyledCard variant="outlined">
            {/* Price banner */}
            <PriceBanner>
                <Typography variant="subtitle2" fontWeight="bold">
                    {venue.price.toLocaleString('no-NO')} NOK / night
                </Typography>
            </PriceBanner>

            {/* Venue image */}
            <CardMedia
                component="img"
                height={200}
                image={mediaUrl}
                alt={venue.media?.[0]?.alt || `${venue.name} venue`}
                sx={{ objectFit: 'cover', flexShrink: 0 }}
            />

            <CardContent 
                sx={{ 
                    p: 2,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column', 
                }}
            >
                {/* Venue name & rating */}
                <Box sx={{ flex: 1}}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {venue.name}
                        </Typography>

                        {venue.rating !== undefined && (
                            <Chip
                                icon={<StarIcon sx={{ color: '#FFD700' }} />}
                                label={venue.rating.toFixed(1)}
                                size="small"
                                sx={{ backgroundColor: 'rgba(255, 215, 0, 0.1' }}
                            />
                        )}
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {locationDisplay}
                </Typography>

                {/* Amenities */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', minHeight: '48px' }}>
                    {venue.meta?.wifi && <AmenityIcon><WifiIcon fontSize="small" /> Wifi</AmenityIcon>}
                    {venue.meta?.parking && <AmenityIcon><LocalParkingIcon fontSize="small" /> Parking</AmenityIcon>}
                    {venue.meta?.breakfast && <AmenityIcon><BreakfastIcon fontSize="small" /> Breakfast</AmenityIcon>}
                    {venue.meta?.pets && <AmenityIcon><PetsIcon fontSize="small" /> Pets</AmenityIcon>}
                </Box>  

                {/* Next available booking */}
                <Typography variant="body2" color={nextAvailableDate === 'Available now' ? 'success.main' : 'text.secondary'} gutterBottom>
                    {nextAvailableDate}
                </Typography>

                {/* Venue owner */}
                {venue.owner?.name && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Hosted by <strong>{venue.owner.name}</strong>
                    </Typography>
                )}

                {/* Action button and options */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2 }}>
                    <GradientButton onClick={handleViewDetails}>
                        View Details
                    </GradientButton>

                    {/* Conditionally render the action button if callbacks are provided */}
                    {(onDelete || onViewBookings || onEdit) && (
                        <>
                            <IconButton onClick={handleMenuOpen} size='small'>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
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
        </StyledCard>
    );
};




export default VenueCard;