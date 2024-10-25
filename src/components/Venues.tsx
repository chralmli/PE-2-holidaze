import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, Skeleton, CardActionArea, Rating } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api'
import { styled } from '@mui/system';

// Icon imports
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import PetsIcon from '@mui/icons-material/Pets';

interface VenueProps {
    limit?: number;
    filter?: string;
    sort?: string;
}

// Styled venue container
const VenuesContainer = styled(Box)({
    width: '100%',
    maxWidth: '1200px',
    marginTop: '40px',
    display: 'grid',
    gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
});

// Card component styled for hover effect
const VenueCard = styled(Card)({
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1',
    borderRadius: '12px',
    textDecoration: 'none',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform:'scale(1.02)',
        boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
    },
});

const HoverOverlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: '20px',
    opacity: 0,
    zIndex: '2',
    transition: 'opacity 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '&:hover': {
        opacity: 1,
    },
});

const StyledButtonBox = styled(Box)({
    marginTop: '16px',
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #34e89e, #0f3443)',
    color: '#fff',
    fontWeight: 500,
    fontSize: '1rem',
    fontFamily: 'Poppins, sans-serif',
    textAlign: 'center',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s ease, color 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #0f3443, #34e89e)',
    },
});

const Venues: React.FC<VenueProps> = ({ limit = 12, filter, sort }) => {
    const [venues, setVenues] = useState<any[]>([]);
    const [visibleVenues, setVisibleVenues] = useState<number>(limit);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch venues from API based on filter and sort
        const fetchVenues = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let url = '/holidaze/venues';

                // Append filter and sort to URL if provided
                if (filter) {
                    url += `?filter=${filter}`;
                }
                if (sort) {
                    url += filter ? `&sort=${sort}` : `?sort=${sort}`;
                }

                const response = await api.get(url);
                setVenues(response.data.data);
                console.log(response.data.data);
            } catch (error) {
                console.error('Error fetching venues:', error);
                setError('Failed to load venues. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchVenues();
    }, [filter, sort]);

    const handleLoadMore = () => {
        setVisibleVenues((prev) => prev + 12);
    };

    return (
        <>
            {isLoading ? ( // Show skeletons while loading
                <VenuesContainer>
                    {[...Array(limit)].map((_, index) => ( // Create placeholder skeletons 
                        <Card key={index}>
                            <CardContent>
                                <Skeleton variant="rectangular" height={140} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </CardContent>
                        </Card>
                    ))}
                </VenuesContainer>
            ) : error ? ( 
                // Show error message
                <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                    <Typography variant="h4">{error}</Typography>
                </Box>
            ) : (
                // Show venues when loaded and no error
                <>
                    <VenuesContainer>
                        {venues.slice(0, visibleVenues).map((venue) => (
                            <Link to={`/venue/${venue.id}`} key={venue.id} style={{ textDecoration: 'none' }}>
                                <VenueCard>
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={venue.media.length > 0 ? venue.media[0].url : 'https://via.placeholder.com/300'}
                                            alt={venue.media.length > 0 ? venue.media[0].alt : 'Venue Image'}
                                        />

                                        {/* Main Content */}
                                        <CardContent sx={{ padding: '16px' }}>
                                            {/* Venue Name */}
                                            <Typography 
                                                variant="h5"
                                                component="div"
                                                sx={{ 
                                                        fontWeight: 700,
                                                        fontFamily: 'Poppins, sans-serif',
                                                        fontSize: '1.25rem',
                                                        color: 'primary.main',
                                                    }} 
                                                >
                                                {venue.name}
                                            </Typography>

                                            {/* Price and Location */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mt: 2,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <LocationOnIcon sx={{ mr: 0.5, color: '#757575' }} />
                                                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                        {venue.location?.city && venue.location?.country
                                                        ? `${venue.location.city}, ${venue.location.country}`
                                                        : 'Unknown Location'}
                                                    </Typography>
                                                </Box>
                                                
                                                {/* Price per night */}
                                                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                                                    <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                        ${venue.price}
                                                    </Typography>
                                                    <Typography variant="subtitle2" color="text.secondary" sx={{ ml: 0.5, color: '#b0b0b0', fontSize: '1rem' }}>
                                                        /night
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Description */}
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary" 
                                                sx={{ 
                                                    marginBottom: '8px', 
                                                    marginTop: '8px',                                                    color: '#757575', 
                                                    lineHeight: 1.5, 
                                                    maxHeight: '40px', 
                                                    overflow: 'hidden', 
                                                    textOverflow: 'ellipsis', 
                                                    whiteSpace: 'nowrap' 
                                                }}
                                            >
                                                {venue.description}
                                            </Typography>

                                            {/* Show Offer Button */}
                                            <StyledButtonBox>
                                                Show offer
                                            </StyledButtonBox>
                                        </CardContent>
                                    </CardActionArea>
                                    {/* Hover Overlay for additional info */}
                                    <HoverOverlay className='hover-overlay'>
                                            <Box>
                                                {/* Rating */}
                                                <Rating
                                                    name="read-only"
                                                    value={venue.rating}
                                                    readOnly
                                                    precision={0.5}
                                                    sx={{ 
                                                        mb: 1,
                                                        color: "#ffd60a",
                                                     }}
                                                     emptyIcon={
                                                        <StarBorderIcon
                                                            fontSize="inherit"
                                                            sx={{ color: 'white' }}
                                                        />
                                                     }
                                                />
                                                    
                                                <Box sx={{ display: 'flex', gap: '8px' }}>
                                                    {venue.meta.wifi && <WifiIcon color="secondary" />}
                                                    {venue.meta.parking && <LocalParkingIcon color="secondary" />}
                                                    {venue.meta.breakfast && <FreeBreakfastIcon color="secondary" />}
                                                    {venue.meta.pets && <PetsIcon color="secondary" />}
                                                </Box>
                                            </Box>
                                        </HoverOverlay>                                                                          
                                </VenueCard>
                            </Link>
                        ))}
                    </VenuesContainer>
                    
                    
                    {visibleVenues < venues.length && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Button 
                                variant="contained" 
                                onClick={handleLoadMore}
                                color="gradient"
                                sx={{
                                    color: '#fff',
                                    fontFamily: 'Poppins',
                                    fontSize: '1rem',
                                    padding: '10px 20px',
                                    textTransform: 'capitalize',
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0',
                                    },
                                }}
                            >
                                Load more
                            </Button>
                        </Box>
                    )}
                </>
            )}
        </>
    );
};

export default Venues;