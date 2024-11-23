import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import React,{ useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Skeleton, Rating, IconButton } from '@mui/material';
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

import { styled } from '@mui/system';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const VenueDetailsContainer = styled(Box)(({ theme }) => ({
    maxWidth: '1200px',
    margin: '40px auto',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
        margin: '10px auto',
    },
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    position: 'relative'
}));

const ImageGallery = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    borderRadius: '10px',
    overflow: 'hidden',
    '& img': {
        width: '100%',
        height: '300px',
        objectFit: 'cover',
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform:'scale(1.02)',
        },
    },
    // First image is larger
    '& img:first-of-type': {
        gridColumn: '1 / -1',
        height: '400px',
    },
    [theme.breakpoints.down('sm')]: {
        '& img': {
            height: '250px',
        },
        '& img:first-of-type': {
            height: '300px',
        },
    },
}));

const InfoSection = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
    },
}));

const AmenityChip = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    '& .MuiSvgIcon-root': {
        color: theme.palette.primary.main,
        fontSize: { xs: '1.2rem', sm: '1.5rem' },
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5, 1),
        fontSize: '0.875rem',
    },
}));


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
                <VenueDetailsContainer>
                    {[...Array(4)].map((_, index) => (
                        <Skeleton
                            key={index}
                            variant={index === 1 ? "rectangular" : "text"}
                            height={index === 1 ? 400 : 80}
                            width={index === 0 ? "60%" : index === 2 ? "80%" : "50%"}
                        />
                    ))}
                </VenueDetailsContainer>
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
            <VenueDetailsContainer>
                {/* Conditionally render Management controls for venue managers */}
                {isManagerView && (
                    <Box 
                        sx={{ 
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            zIndex: 1,
                            mt: 4,
                            display: 'flex', 
                            gap: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 2, 
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
                    </Box>
                )}

                {/* Media gallery */}
                <ImageGallery>
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
                </ImageGallery>

                {/* Main content */}
                <InfoSection>
                    {/* Left column - Main info */}
                    <Box>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 'bold', 
                                mb: 2,
                                fontSize: {
                                    xs: '1.4rem',
                                    sm: '2rem',
                                    md: '2.5rem'
                                }
                            }}
                        >
                            {venue.name}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#34e89e' }}>
                                {venue.price.toLocaleString('no-NO')} NOK
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontSize: { xs: '1rem' }}} color="text.secondary">
                                per night
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" sx={{ mb: 2 }}>
                                About this venue
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                                {venue.description}
                            </Typography>    
                        </Box>

                        {/* Amenities */}
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            Amenities
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                            {venue.meta.wifi && (
                                <AmenityChip>
                                    <Wifi /> Wifi
                                </AmenityChip>
                            )}
                            {venue.meta.parking && (
                                <AmenityChip>
                                    <LocalParking /> Parking
                                </AmenityChip>
                            )}
                            {venue.meta.breakfast && (
                                <AmenityChip>
                                    <FreeBreakfast /> Breakfast
                                </AmenityChip>
                            )}
                            {venue.meta.pets && (
                                <AmenityChip>
                                    <Pets /> Pets
                                </AmenityChip>
                            )}
                        </Box>

                        {/* Location */}
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            Location
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            {locationDetails.join(', ')}
                        </Typography>

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
                    </Box>

                    {/* Right column - Booking & Details */}
                    <Box sx={{ position: 'sticky', top: 24 }}>
                        <Box sx={{
                            padding: { xs: 2, sm: 3 },
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            backgroundColor: 'background.paper',
                            mb: 3,
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Rating value={venue.rating || 0} precision={0.5} readOnly />
                                <Typography variant="body2" color="text.secondary">
                                    {venue.rating ? `${venue.rating.toFixed(1)} rating` : 'No ratings yet'}
                                </Typography>
                            </Box>

                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Up to {venue.maxGuests} guests
                            </Typography>

                            {!isManagerView && <BookingForm venueId={venue.id} maxGuests={venue.maxGuests} />}
                        </Box>
                    </Box>
                </InfoSection>

                {/* Bookings modal for venue managers */}
                {isManagerView && venue.bookings && (
                    <BookingsModal
                        venueId={venue.id}
                        open={isBookingsModalOpen}
                        onClose={() => setIsBookingsModalOpen(false)}
                    />
                )}
            </VenueDetailsContainer>
        );
};
                

export default VenueDetails;