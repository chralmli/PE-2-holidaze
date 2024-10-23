import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';

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

const Venues: React.FC<VenueProps> = ({ limit = 12, filter, sort }) => {
    const [venues, setVenues] = useState<any[]>([]);
    const [visibleVenues, setVisibleVenues] = useState<number>(limit);

    useEffect(() => {
        // Fetch venues from API based on filter and sort
        const fetchVenues = async () => {
            try {
                let url = 'https://v2.api.noroff.dev/holidaze/venues?_bookings=true';

                // Append filter and sort to URL if provided
                if (filter) {
                    url += `&filter=${filter}`;
                }
                if (sort) {
                    url += `&sort=${sort}`;
                }

                const response = await axios.get(url);
                setVenues(response.data.data);
            } catch (error) {
                console.error('Error fetching venues:', error);
            }
        };
        fetchVenues();
    }, [filter, sort]);

    const handleLoadMore = () => {
        setVisibleVenues((prev) => prev + 12);
    };

    return (
        <>
            <VenuesContainer>
                {venues.slice(0, visibleVenues).map((venue) => (
                    <Card key={venue.id}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={venue.media.length > 0 ? venue.media[0].url : 'https://via.placeholder.com/300'}
                        alt={venue.media.length > 0 ? venue.media[0].alt : 'Venue Image'}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {venue.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {venue.description}
                        </Typography>
                    </CardContent>
                </Card>
                ))}
            </VenuesContainer>
            {visibleVenues < venues.length && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Button variant="contained" onClick={handleLoadMore}>
                        Load More
                    </Button>
                </Box>
            )}
        </>
    );
};

export default Venues;