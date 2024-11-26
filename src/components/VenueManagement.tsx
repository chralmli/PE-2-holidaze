import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import { getVenuesByUserId } from '../services/venueService';
import { handleDeleteVenue } from '../services/venueUtils';
import { Venue } from '../types/Venue';
import VenueCard from './VenueCard';
import useUserProfile from '../hooks/useUserProfile';
import { useNavigate } from 'react-router-dom';
import BookingsModal from './BookingsModal';
import useBookingModal from '../hooks/useBookingModal';

const VenueManagement: React.FC = () => {
  const { profile, loading: profileLoading, error: profileError } = useUserProfile();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // State to manage bookings modal visibility and selected venue ID
const { isModalOpen, selectedVenueId, openModal, closeModal } = useBookingModal();

  useEffect(() => {
    const fetchVenues = async () => {
      if (!profile?.name) {
        setError('No user profile found');
        return;
      }

      try {
        setLoading(true);
        // Fetch venues owned by the current logged-in user
        const venuesData = await getVenuesByUserId(profile.name);
        setVenues(venuesData);
      } catch (error: any) {
        console.error('Error fetching venues:', error);
        setError(error?.response?.data?.message || 'Failed to fetch venues');
        if (error?.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!profileLoading) {
      fetchVenues();
    }
  }, [profile, profileLoading, navigate]);

  if (error || profileError) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">
          {error || profileError}
        </Typography>
      </Box>
    );
  }

  const handleDeleteVenueClick = (venueId: string) => {
    handleDeleteVenue(venueId, () => {
      setVenues((prevVenues) => prevVenues.filter((venue) => venue.id !== venueId));
    });
  };

const handleViewBookings = (venueId: string) => {
  openModal(venueId);
};

const handleEditVenue = (venueId: string) => {
  navigate(`/venues/edit/${venueId}`);
};

if (loading || profileLoading) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
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
        <Grid container spacing={3}>
          {venues.map((venue) => (
            <Grid item xs={12} sm={6} md={4} key={venue.id}>
              <VenueCard
                key={venue.id}
                venue={venue}
                isManagerView={true}
                onDelete={handleDeleteVenueClick}
                onViewBookings={handleViewBookings}
                onEdit={handleEditVenue}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Bookings Modal */}
      {selectedVenueId && (
        <BookingsModal
          open={isModalOpen}
          onClose={closeModal}
          venueId={selectedVenueId}
        />
      )}
    </Box>
  );
};

export default VenueManagement;