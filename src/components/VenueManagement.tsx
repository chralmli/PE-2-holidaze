import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import { getVenuesByUserId, deleteVenue } from '../services/venueService';
import { Venue } from '../types/Venue';
import VenueCard from './VenueCard';
import useUserProfile from '../hooks/useUserProfile';
import { useNavigate } from 'react-router-dom';
import BookingsModal from './BookingsModal';

const VenueManagement: React.FC = () => {
  const { profile, loading: profileLoading } = useUserProfile();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // State to manage bookings modal visibility and selected venue ID
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      if (!profile) return;

      try {
        setLoading(true);
        // Fetch venues owned by the current logged-in user
        const venuesData = await getVenuesByUserId(profile.name);
        setVenues(venuesData);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!profileLoading) {
      fetchVenues();
    }
  }, [profile, profileLoading]);

  const handleDeleteVenue = async (venueId: string) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
    try {
      await deleteVenue(venueId);
      setVenues((prevVenues) => prevVenues.filter((venue) => venue.id !== venueId));
    } catch (error) {
      console.error('Error deleting venue:', error);
    }
  }
};

const handleViewBookings = (venueId: string) => {
  // Open the bookings modal for the selected venue
  setSelectedVenueId(venueId);
  setIsModalOpen(true);
};

const handleEditVenue = (venueId: string) => {
  navigate(`/venues/edit/${venueId}`);
};

// Function to close the bookings modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVenueId(null);
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
                onDelete={handleDeleteVenue}
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
          onClose={handleCloseModal}
          venueId={selectedVenueId}
        />
      )}
    </Box>
  );
};

export default VenueManagement;