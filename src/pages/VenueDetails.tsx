import React from 'react';
import { useParams } from 'react-router-dom';
import { Venue } from '../types/Venue';
import { getVenueById } from '../services/venueService';
import { Box, Typography, Skeleton, Rating } from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast"
import PetsIcon from '@mui/icons-material/Pets';
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
});

const MediaContainer = styled(Box)({
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
});

const VenueDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [venue, setVenue] = React.useState<Venue | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
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

        return (
            <VenueDetailsContainer>
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
                    {venue.rating > 0 ? (
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
                    {venue.location.address}, {venue.location.city}, {venue.location.zip}, {venue.location.country}
                </Typography>

                {/* Map Section */}
                {venue.location.lat && venue.location.lng && (
                    <MapContainer
                        center={[venue.location.lat, venue.location.lng]}
                        zoom={13}
                        style={{ width: '100%', height: '400px', borderRadius: '10px' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />
                        <Marker position={[venue.location.lat, venue.location.lng]}>
                            <Popup>
                                {venue.name}
                                {venue.location.city}, {venue.location.country}
                            </Popup>
                        </Marker>
                    </MapContainer>
                )}
            </VenueDetailsContainer>
        );
    };

export default VenueDetails;