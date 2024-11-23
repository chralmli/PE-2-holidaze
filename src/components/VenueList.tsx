import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import VenueCard from './VenueCard';
import { Venue } from '../types/Venue';
import api from '../services/api';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface VenueListProps {
  venues: Venue[];
  isLoading: boolean;
  onHover: (venueId: string | null) => void;
  hoveredVenueId: string | null;
  fetchMode?: 'popular' | 'bestRated';
  useSlider?: boolean;
}

const VenueList: React.FC<VenueListProps> = ({ 
  venues = [],
  isLoading = false,
  onHover = () => {},
  hoveredVenueId = null,
  fetchMode,
  useSlider = false,
 }) => {
  const [fetchedVenues, setFetchedVenues] = useState<Venue[]>([]);
  const [fetchingVenues, setFetchingVenues] = useState<boolean>(false);

  // Fetch the appropriate venues if `fetchMode` is provided
  useEffect(() => {
    const fetchVenues = async () => {
      if (fetchMode) {
        setFetchingVenues(true);
        try {
          let response;
          if (fetchMode === 'popular') {
            response = await api.get('/holidaze/venues?_bookings=true&_owner=true');
            const venuesWithBookings = response.data.data;

            // Sort venues by the number of bookings in descending order and limit to 6
            const sortedVenues = venuesWithBookings
             .sort((a: Venue, b: Venue) => (b.bookings?.length ?? 0) - (a.bookings?.length ?? 0))
              .slice(0, 6);
            setFetchedVenues(sortedVenues);
          } else if (fetchMode === 'bestRated') {
            response = await api.get('/holidaze/venues');
            const venuesWithRating = response.data.data

            // Sort venues by rating in descending order and limit to 6
            const sortedVenues = venuesWithRating
              .sort((a: Venue, b: Venue) => (b.rating ?? 0) - (a.rating ?? 0))
              .slice(0, 6);
            setFetchedVenues(sortedVenues);
          }
        } catch (error) {
          console.error('Error fetching venues:', error);
        } finally {
          setFetchingVenues(false);
        }
      }
    };

    fetchVenues();
  }, [fetchMode]);

  // Determine which venues to display: fetched or provided ones
  const displayVenues = fetchMode ? fetchedVenues : venues;

  // if loading, display a loading spinner
  if (fetchingVenues || isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // if no venues are found, display a message
  if (displayVenues.length === 0) {
    return (
      <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
        No venues match your search or filters. Try modifying your criteria.
      </Typography>
    );
  }

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1080,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // If the slider is needed, wrap the venue cards in a slider component
  if (useSlider) {
    return (
      <Slider {...sliderSettings}>
        {displayVenues.map((venue) => (
          <Box key={venue.id} px={2}>
            <VenueCard venue={venue} />
          </Box>
        ))}
      </Slider>
    );
  }

  // Default grid display for venues
  return (
    <Grid container spacing={4}>
      {displayVenues.map((venue) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          lg={4}
          key={venue.id}
          onMouseEnter={() => onHover(venue.id)}
          onMouseLeave={() => onHover(null)}
          sx={{
            maxWidth: {
              md: '50%',
              lg: '33.3333%',
            }
          }}
        >
          <VenueCard venue={venue} />
        </Grid>
      ))}
    </Grid>
  );
};

export default VenueList;