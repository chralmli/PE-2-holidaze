import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import VenueCard from './VenueCard';
import { Venue } from '../types/Venue';

interface VenueSectionProps {
  venues?: Venue[];
  venueCount?: number;
}

const VenueSection: React.FC<VenueSectionProps> = ({ venues, venueCount }) => (
  <Box sx={{ marginBottom: '40px' }}>
    <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>
      Your venues ({venueCount || 0})
    </Typography>
    {(!venues || venues.length === 0) ? (
      <Typography variant="body1" color="text.secondary">
        You have no venues listed.
      </Typography>
    ) : (
      <Grid container spacing={3}>
        {venues.map((venue) => (
          <Grid item xs={12} sm={6} md={4} key={venue.id}>
            <VenueCard key={venue.id} venue={venue} />
          </Grid>
        ))}
      </Grid>
    )}
  </Box>
);

export default VenueSection;