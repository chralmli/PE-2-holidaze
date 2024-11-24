import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import React,{ useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Skeleton, Rating, IconButton, Paper, Container, Grid } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Icons
import { Wifi, LocalParking, FreeBreakfast, Pets, Edit, Delete, Book } from '@mui/icons-material';

// Services and hooks
import { getVenueById } from '../services/venueService';
import { handleDeleteVenue } from '../services/venueUtils';

// Types
import { Venue } from '../types/Venue';

// Components
import BookingForm from '../components/BookingForm';
import BookingsModal from '../components/BookingsModal';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface VenueDetailsProps {
    isManagerView?: boolean;
}

const VenueDetails: React.FC<VenueDetailsProps> = ({ isManagerView = false }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [venue, setVenue] = useState<Venue | null>(null);
    const [isBookingsModalOpen, setIsBookingsModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchVenue = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await getVenueById(id);
                setVenue(data);
            } catch (error) {
                console.error('Error fetching venue:', error);
                navigate('/venues');
            } finally {
                setLoading(false);
            }
        };

        fetchVenue();
    }, [id, navigate]);

        const handleDeleteVenueClick = () => {
            if (!venue) return;
            handleDeleteVenue(venue.id, () => navigate('/admin'));
        };

        if (loading) {
            return (
                <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                    <Box sx={{ display: 'fkex', flexDirection: 'column', gap: 3 }}>
                        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 4 }} />
                        <Skeleton variant="text" height={60} width="60%" />
                        <Skeleton variant="text" height={30} width="30%" />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {[...Array(3)].map((_, index) => (
                            <Skeleton key={index} variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
                            ))}
                        </Box>
                    </Box>
                </Container>
            );
        }
        
        if (!venue) return <Typography variant="h4">Venue not found</Typography>

        // Handle unknown location values
        const locationDetails = [
            venue.location.address,
            venue.location.city,
            venue.location.zip,
            venue.location.country,
        ].filter(Boolean);

        const hasValidCoordinates = (venue: Venue): boolean => {
            return !!(
                venue.location &&
                typeof venue.location.lat === 'number' &&
                typeof venue.location.lng === 'number' &&
                venue.location.lat !== 0 &&
                venue.location.lng !== 0 &&
                !isNaN(venue.location.lat) &&
                !isNaN(venue.location.lng)
            );
        };

        return (
            <Container
                maxWidth="lg"
                sx={{
                    py: { xs: 4, md: 8 },
                    position:'relative',
                }}
            >
                {/* Management controls for venue managers */}
                {isManagerView && (
                    <Paper
                        elevation={0} 
                        sx={{ 
                            position: 'absolute',
                            top: 32,
                            right: 32,
                            zIndex: 10,
                            display: 'flex', 
                            gap: 1,
                            p: 1,
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid',
                            borderColor: 'grey.100',
                            borderRadius: 3, 
                        }}
                    >
                        <IconButton
                            color="primary"
                            onClick={() => navigate(`/venues/edit/${venue.id}`)}
                            aria-label="edit venue"
                        >
                            <Edit />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={handleDeleteVenueClick}
                            aria-label="delete venue"
                        >
                            <Delete />
                        </IconButton>
                        <IconButton
                            color="primary"
                            onClick={() => setIsBookingsModalOpen(true)}
                            aria-label="view bookings"
                        >
                            <Book />
                        </IconButton>
                    </Paper>
                )}

                {/* Media gallery */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 2,
                    mb: 6,
                    '& img': {
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: theme => `0 8px 24px ${theme.palette.grey[200]}`,
                        },
                    },
                    '& img:first-of-type': {
                        gridColumn: '1 / -1',
                        height: '500px',
                    },
                }}>
                    {venue.media.length ? (
                        venue.media.map((mediaItem, index) => (
                            <img
                                key={index}
                                src={mediaItem.url}
                                alt={mediaItem.alt || `Venue image ${index +1}`}
                                loading={index === 0 ? 'eager' : 'lazy'}
                            />
                        ))
                    ) : (
                        <Box
                            sx={{
                                height: '400px',
                                backgroundColor: 'grey.100',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="body1" color="text.secondary">
                                No images available.
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Main content */}
                <Grid container spacing={4}>
                    {/* Left column - Main info */}
                    <Grid item xs={12} md={8}>
                        <Box>
                            {/* Title and Price */}
                            <Typography 
                                variant="h2" 
                                sx={{ 
                                    fontWeight: 700, 
                                    mb: 3,
                                    background: 'linear-gradient(135deg, #0f3443 0%, #34e89e 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {venue.name}
                            </Typography>

                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 2, 
                                    mb: 4,
                                    p: 3,
                                    borderRadius: 3,
                                    background: (theme) => theme.palette.grey[50],
                                }}
                            >
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 700, 
                                        color: 'primary.main' 
                                    }}
                                >
                                    {venue.price.toLocaleString('no-NO')} NOK
                                </Typography>
                                <Typography 
                                    variant="subtitle1" 
                                    color="text.secondary"
                                >
                                    per night
                                </Typography>
                            </Box>

                            {/* Description */}

                            <Box sx={{ mb: 6 }}>
                                <Typography 
                                    variant="h4"
                                    gutterBottom 
                                    sx={{ fontWeight: 600 }}
                                >
                                    About this venue
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        lineHeight: 1.8, 
                                        color: 'text.secondary' 
                                    }}
                                >
                                    {venue.description}
                                </Typography>    
                            </Box>

                        {/* Amenities */}
                        <Box sx={{ mb: 6 }}>
                            <Typography 
                                variant="h4"
                                gutterBottom
                                sx={{ fontWeight: 600 }}
                            >
                                Amenities
                            </Typography>
                            <Grid container spacing={2}>
                                {[
                                    { available: venue.meta.wifi, icon: <Wifi />, label: 'Wifi' },
                                    { available: venue.meta.parking, icon: <LocalParking />, label: 'Parking' },
                                    { available: venue.meta.breakfast, icon: <FreeBreakfast />, label: 'Breakfast' },
                                    { available: venue.meta.pets, icon: <Pets />, label: 'Pets Allowed' },
                                ].map((amenity, index) =>
                                    amenity.available && (
                                        <Grid item xs={6} sm={3} key={index}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    textAlign: 'center',
                                                    borderRadius: 3,
                                                    border: '1px solid',
                                                    borderColor: 'grey.200',
                                                    backgroundColor: 'background.paper',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: 2,
                                                    },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        color: 'primary.main',
                                                        mb: 1
                                                    }}
                                                >
                                                    {amenity.icon}
                                                </Box>
                                                <Typography variant="body2">
                                                    {amenity.label}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        )
                                    )}
                                </Grid>
                            </Box>

                    {/* Location */}
                    <Box sx={{ mb: 6 }}>
                        <Typography 
                            variant="h4" 
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                        >
                            Location
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                mb: 3,
                                color: 'text.secondary'
                            }}
                        >
                            {locationDetails.join(', ')}
                        </Typography>

                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'grey.200',
                                height: 400
                            }}
                        >
                            {/* Map */}
                            {hasValidCoordinates(venue) ? (
                                <MapContainer
                                    key={`${venue.location.lat}-${venue.location.lng}`}
                                    center={[venue.location.lat!, venue.location.lng!]}
                                    zoom={13}
                                    style={{ height: '400px', borderRadius: '12px', marginBottom: '24px' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
                                    />
                                    <Marker position={[venue.location.lat!, venue.location.lng!]}>
                                        <Popup>
                                            <strong>{venue.name}</strong>
                                            <br />
                                            {venue.location.city}, {venue.location.country}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <Box
                                    sx={{
                                        height: '400px',
                                        backgroundColor: 'grey.100',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '12px',
                                    }}
                                >
                                    <Typography variant="body1" color="text.secondary">
                                        Map information is not available
                                    </Typography>
                                </Box>
                            )}
                            </Paper>
                        </Box>
                    </Box>  
                </Grid>

                {/* Right column - Booking & Details */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ position: 'sticky', top: 24 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                border: '1px solid',
                                borderColor: 'grey.200',
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 3,
                            }}>
                                <Rating 
                                    value={venue.rating || 0} 
                                    precision={0.5} 
                                    readOnly 
                                    sx={{
                                        '& .MuiRating-IconFilled': {
                                            color: 'secondary.main'
                                        }
                                    }}
                                />
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                >
                                    {venue.rating ? 
                                        `${venue.rating.toFixed(1)} rating` : 
                                        'No ratings yet'
                                    }
                                </Typography>
                            </Box>

                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mb: 3,
                                    color: 'text.secondary',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                Up to {venue.maxGuests} guests
                            </Typography>

                            {!isManagerView && 
                                <BookingForm 
                                    venueId={venue.id} 
                                    maxGuests={venue.maxGuests} 
                                />
                            }
                        </Paper>
                    </Box>
                </Grid>
            </Grid>

            {/* Bookings modal for venue managers */}
            {isManagerView && venue.bookings && (
                <BookingsModal
                    venueId={venue.id}
                    open={isBookingsModalOpen}
                    onClose={() => setIsBookingsModalOpen(false)}
                />
            )}
        </Container>
    );
};
                

export default VenueDetails;