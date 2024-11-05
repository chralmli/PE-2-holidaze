import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { getVenuesByUserId, deleteVenue } from '../services/venueService';
import { Venue } from '../types/Venue';
import { useAuth } from '../context/AuthContext';

const VenueManagement: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVenues = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Fetch venues owned by the current logged-in user
        const venuesData = await getVenuesByUserId(user.name);
        setVenues(venuesData);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteVenue(id);
      setVenues((prevVenues) => prevVenues.filter((venue) => venue.id !== id));
    } catch (error) {
      console.error('Error deleting venue:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2}}>
        Venue Management
      </Typography>
      {venues.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No venues found.
        </Typography>
      ) : (
        venues.map((venue) => (
          <Box key={venue.id} sx={{ mb: 2, border: '1px solid #e0e0e0', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: 2}}>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              {venue.name}
            </Typography>
            <Typography>Guests: {venue.maxGuests}</Typography>
            <Typography>Price per night: ${venue.price}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {venue.description}
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => handleDelete(venue.id)}>
              Delete
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
};

export default VenueManagement;