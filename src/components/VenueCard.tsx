import React, { useState, useMemo } from 'react';
import { SxProps, Theme } from '@mui/system';
import { Card, CardContent, Typography, Button, CardMedia, Box, IconButton, Menu, MenuItem, Chip, Skeleton, alpha} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Venue } from '../types/Venue'
import {
    MoreVert as MoreVertIcon,
    Star as StarIcon,
    Wifi as WifiIcon,
    LocalParking as LocalParkingIcon,
    Restaurant as BreakfastIcon,
    Pets as PetsIcon,
    CalendarMonth as CalendarIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

type VenueCardProps = {
    venue: Venue;
    onDelete?: (venueId: string) => void;
    onViewBookings?: (venueId: string) => void;
    onEdit?: (venueId: string) => void;
    isManagerView?: boolean;
    isLoading?: boolean;
    sx?: SxProps<Theme>;
};

const VenueCard: React.FC<VenueCardProps> = ({ venue, onDelete, onViewBookings, onEdit, sx, isManagerView = false, isLoading = false }) => {
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
        const city = venue.location?.city || 'City';
        const country = venue.location?.country || 'Country';
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

    if (isLoading) {
        return (
            <Card 
                sx={{ 
                    height: '500px',
                    borderRadius: 3,
                    boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
                    ...sx 
                }}
            >
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="30%" />
                    <Box sx={{ mt: 2 }}>
                        <Skeleton variant="rectangular" width={120} height={36} />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            sx={{
                height: '500px',
                borderRadius: 3,
                position: 'relative',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.paper',
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
                border: '1px solid',
                borderColor: 'grey.100',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => `0 12px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
                },
                ...sx,
            }}
        >
            {/* Price banner */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1,
                    background: (theme) => alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: 'blur(8px)',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    border: '1px solid',
                    borderColor: 'grey.100',
                }}
            >
                <Typography variant="subtitle2" fontWeight="600" color="grey.800">
                    {venue.price.toLocaleString('no-NO')} NOK
                </Typography>
                <Typography variant="caption" color="grey.600">
                    per night
                </Typography>
            </Box>

            {/* Venue image */}
            <CardMedia
                component="img"
                height={200}
                image={mediaUrl}
                alt={venue.media?.[0]?.alt || `${venue.name} venue`}
                sx={{ objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
            />

            <CardContent 
                sx={{ 
                    p: 3,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column', 
                }}
            >
                {/* Header section */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1
                    }}
                    >
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.2,
                            }}
                        >
                            {venue.name}
                        </Typography>

                        {venue.rating !== undefined && (
                            <Chip
                                icon={<StarIcon sx={{ color: '#FFD700 !important' }} />}
                                label={venue.rating.toFixed(1)}
                                size="small"
                                sx={{ 
                                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                    borderRadius: 2,
                                    '.MuiChip-label': {
                                        px: 1,
                                        fontWeight: 600
                                    }
                                 }}
                            />
                        )}
                    </Box>

                    <Typography 
                        variant="body2"
                        color="text.secondary" 
                        sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}
                    >
                        {locationDisplay}
                    </Typography>
                </Box>

                {/* Amenities */}
                <Box 
                    sx={{  
                        display: 'flex',
                        gap: 2,
                        mb: 2,
                        flexWrap: 'wrap'
                    }}
                >
                    {venue.meta?.wifi && (
                        <Chip
                            icon={<WifiIcon fontSize="small" />}
                            label="Wifi"
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        />
                    )}
                    {venue.meta?.parking && (
                        <Chip
                            icon={<LocalParkingIcon fontSize="small" />}
                            label="Parking"
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        />
                    )}
                    {venue.meta?.breakfast && (
                        <Chip
                            icon={<BreakfastIcon fontSize="small" />}
                            label="Breakfast"
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        />
                    )}
                    {venue.meta?.pets && (
                        <Chip
                            icon={<PetsIcon fontSize="small" />}
                            label="Pets"
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        />
                    )}
                </Box>

                {/* Info Section */}
                <Box sx={{ mb: 2 }}>
                    <Typography 
                        variant="body2"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 1,
                            color: nextAvailableDate === 'Available now' ? 'success.main' : 'text.secondary'
                        }}
                    >
                        <CalendarIcon fontSize="small" />
                        {nextAvailableDate}
                    </Typography>

                    {venue.owner?.name && (
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <PersonIcon fontSize="small" />
                            Hosted by <strong>{venue.owner.name}</strong>
                        </Typography>
                    )}
                </Box>

                {/* Actions section */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 'auto'
                    }}
                >
                    <Button 
                        variant="contained"
                        color="gradient"
                        onClick={() => navigate(`/${isManagerView ? 'admin/venue/' : 'venue/'}${venue.id}`)}
                        sx={{ px: 3 }}
                    >
                        View Details
                    </Button>

                    {(onDelete || onViewBookings || onEdit) && (
                        <>
                            <IconButton
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                                size="small"
                                sx={{
                                    color: 'grey.600',
                                    '&:hover': {
                                        color: 'primary.main',
                                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08)
                                    }
                                }}
                            >
                                <MoreVertIcon />
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        borderRadius: 3,
                                        mt: 1,
                                        minWidth: 180,
                                        boxShadow: (theme) =>
                                            `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                                        border: '1px solid',
                                        borderColor: 'grey.100',
                                    }
                                }}
                            >
                                {onViewBookings && (
                                    <MenuItem
                                        onClick={() => {
                                            setAnchorEl(null);
                                            onViewBookings(venue.id);
                                        }}
                                    >
                                        View Bookings
                                    </MenuItem>
                                )}
                                {onEdit && (
                                    <MenuItem
                                        onClick={() => {
                                            setAnchorEl(null);
                                            onEdit(venue.id);
                                        }}
                                    >
                                        Edit Venue
                                    </MenuItem>
                                )}
                                {onDelete && (
                                    <MenuItem
                                        onClick={() => {
                                            setAnchorEl(null);
                                            onDelete(venue.id);
                                        }}
                                        sx={{ color: 'error.main' }}
                                    >
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