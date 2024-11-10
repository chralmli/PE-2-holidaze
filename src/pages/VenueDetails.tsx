import React,{ useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Venue } from '../types/Venue';
import { getVenueById } from '../services/venueService';
import { handleDeleteVenue } from '../services/venueUtils';
import BookingForm from '../components/BookingForm';
import BookingsModal from '../components/BookingsModal';
import useBookingModal from '../hooks/useBookingModal';
import { Box, Typography, Skeleton, Rating, Button, IconButton } from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast"
import PetsIcon from '@mui/icons-material/Pets';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookIcon from '@mui/icons-material/Book';
import { styled } from '@mui/system';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
        if (id) {
            setLoading(true);
            getVenueById(id)
                .then((data) => {
                    setVenue(data);
                })
                .catch((error) => {
                    console.error('Error fetching venue:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
            }
        }, [id]);

        const handleDeleteVenueClick = () => {
            if (!venue) return;
            handleDeleteVenue(venue.id, () => {
                navigate('/admin');
            });
        };

        if (loading) {
            return (
                <VenueDetailsContainer>
                    <Skeleton variant="text" height={80} width="60%" />
                    <Skeleton variant="rectangular" height={400} />
                    <Skeleton variant="text" height={40} width="80%" />
                    <Skeleton variant="text" height={40} width="50%" />
                </VenueDetailsContainer>
            );
        }
        
        if (!venue) {
            return <div>Venue not found.</div>;
        }

        // Handle unknown location values
        const locationString = [
            venue.location.address || 'Address not available',
            venue.location.city || 'City not available',
            venue.location.zip || 'Zip code not available',
            venue.location.country || 'Country not available',
        ].filter(Boolean).join(', ');

        const hasValidCoordinates = 
            venue.location.lat !== undefined && 
            venue.location.lng !== undefined && 
            venue.location.lat !== 0 && 
            venue.location.lng !== 0;

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
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={handleDeleteVenueClick}
                            aria-label="delete venue"
                        >
                            <DeleteIcon />
                        </IconButton>
                        <IconButton
                            color="primary"
                            onClick={() => openModal(venue.id)}
                            aria-label="view bookings"
                        >
                            <BookIcon />
                        </IconButton>
                    </Box>
                )}

                {/* Venue Name */}
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {venue.name}
                </Typography>

                {/* Media Section */}
                <MediaContainer>
                    {venue.media && venue.media.length > 0 ? (
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
                <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {venue.price} / night
                    </Typography>
                    {venue.rating !== undefined && venue.rating > 0 ? (
                        <Rating name="read-only" value={venue.rating} readOnly precision={0.5} />
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No rating available.
                        </Typography>
                    )}
                </Box>

                {/* Max Guests */}
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Max Guests: {venue.maxGuests}
                </Typography>

                {/* Amenities */}
                <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {venue.meta.wifi && <WifiIcon color="primary" />}
                    {venue.meta.parking && <LocalParkingIcon color="primary" />}
                    {venue.meta.breakfast && <FreeBreakfastIcon color="primary" />}
                    {venue.meta.pets && <PetsIcon color="primary" />}
                </Box>

                {/* Location information */}
                <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
                    Location
                </Typography>
                <Typography variant="body1">
                    {locationString}
                </Typography>

                {/* Map Section */}
                {hasValidCoordinates && (
                    <MapContainer
                        center={[venue.location.lat ?? 0, venue.location.lng ?? 0]}
                        zoom={13}
                        style={{ width: '100%', height: '400px', borderRadius: '10px' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />
                        <Marker position={[venue.location.lat ?? 0, venue.location.lng ?? 0]}>
                            <Popup>
                                {venue.name}
                                {venue.location.city}, {venue.location.country}
                            </Popup>
                        </Marker>
                    </MapContainer>
                )}
                {!hasValidCoordinates && (
                    <Typography variant="body2" color="text.secondary">
                        Map information is not available for this venue.
                    </Typography>
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