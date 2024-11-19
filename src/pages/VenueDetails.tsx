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
import useBookingModal from '../hooks/useBookingModal';

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

const VenueDetailsContainer = styled(Box)({
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    position: 'relative'
});

const MediaContainer = styled(Box)({
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
});

interface VenueDetailsProps {
    isManagerView?: boolean;
}

const VenueDetails: React.FC<VenueDetailsProps> = ({ isManagerView = false }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [venue, setVenue] = useState<Venue | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { isModalOpen, selectedVenueId, openModal, closeModal } = useBookingModal();

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
        
        if (!venue) return <Typography variant="h6">Venue not found</Typography>

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
                            mt: 4, 
                            display: 'flex', 
                            gap: 2 
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
                            onClick={() => openModal(venue.id)}
                            aria-label="view bookings"
                        >
                            <Book />
                        </IconButton>
                    </Box>
                )}

                {/* Venue Name */}
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {venue.name}
                </Typography>

                {/* Media Section */}
                <MediaContainer>
                    {venue.media?.length ? (
                        venue.media.map((mediaItem, index) => (
                            <img
                                key={index}
                                src={mediaItem.url}
                                alt={mediaItem.alt}
                                style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }}
                            />
                        ))
                    ) : (
                        <Typography variant="body1">No images available.</Typography>
                    )}
                </MediaContainer>

                {/* Description */}
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {venue.description}
                </Typography>

                {/* Price and Rating */}
                <Box display="flex" gap={2} alignItems="center">
                    <Typography variant="h4" fontWeight="bold">
                        {venue.price} / night
                    </Typography>
                    <Rating
                        value={venue.rating || 0}
                        precision={0.5}
                        readOnly
                    />
                </Box>

                {/* Max Guests */}
                <Typography variant="body1" fontWeight="bold">
                    Max Guests: {venue.maxGuests}
                </Typography>

                {/* Amenities */}
                <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {venue.meta.wifi && <Wifi color="primary" />}
                    {venue.meta.parking && <LocalParking color="primary" />}
                    {venue.meta.breakfast && <FreeBreakfast color="primary" />}
                    {venue.meta.pets && <Pets color="primary" />}
                </Box>

                {/* Location information */}
                <Typography variant="h5" fontWeight="bold" mt={2} mb={1}>
                    Location
                </Typography>
                <Typography variant="body1">{locationDetails}</Typography>

                {/* Map Section */}
                {hasValidCoordinates(venue) && (
                    <MapContainer
                    key={`${venue.location.lat}-${venue.location.lng}`}
                        center={[venue.location.lat!, venue.location.lng!]}
                        zoom={13}
                        style={{ width: '100%', height: '400px', borderRadius: '10px' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />
                        {venue.location.lat && venue.location.lng && (
                            <Marker position={[venue.location.lat!, venue.location.lng!]}>
                                <Popup>
                                    {venue.name}
                                    {venue.location.city}, {venue.location.country && (
                                        <div>{venue.location.city}, {venue.location.country}</div>
                                    )}
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                )}
                {!hasValidCoordinates(venue) && (
                    <Box
                        sx={{
                            height: '400px',
                            display: 'flex',
                            justifyContent: 'center',
                            bgcolor: 'grey.100',
                            alignItems: 'center',
                            borderRadius: '10px',
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Map information is not available for this venue.
                        </Typography>
                    </Box>
                )}

                
                {/* Conditionally render booking form for customers */}
                {!isManagerView && <BookingForm venueId={venue.id} />}


                {/* Bookings Modal */}
                {selectedVenueId && (
                    <BookingsModal
                        venueId={selectedVenueId}
                        open={isModalOpen}
                        onClose={closeModal}
                    />
                )}
            </VenueDetailsContainer>
        );
    };

export default VenueDetails;