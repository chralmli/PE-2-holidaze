import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, CircularProgress } from '@mui/material';
import useUserProfile from '../hooks/useUserProfile';
import VenueManagement from '../components/VenueManagement';
import UserBookings from '../components/UserBookings';
import UserProfile from './UserProfile';
import CreateVenueForm from '../components/CreateVenueForm';

const AdminDashboard: React.FC = () => {
  const { profile, loading: profileLoading, error } = useUserProfile();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // handle loading state
  if (profileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // handle error state
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <Typography variant="h5" color="error" sx={{ textAlign: 'center', marginTop: '20px' }}>Error</Typography>
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  // handle unauthorized access
  if (!profile?.venueManager) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <Typography variant="h5">Access Denied</Typography>
        <Typography variant="body1">Please log in with a Venue Manager account to view this page.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2}}>
        Welcome, Venue Manager {profile.name}
      </Typography>

      {/* Tabs for venue manager */}
      <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Profile" />
        <Tab label="Manage Venues" />
        <Tab label="Bookings" />
        <Tab label="Create Venue" />
      </Tabs>

      {/* Render components based on selected tab */}
      {tabIndex === 0 && <UserProfile />}
      {tabIndex === 1 && <VenueManagement />}
      {tabIndex === 2 && <UserBookings />}
      {tabIndex === 3 && <CreateVenueForm />}
    </Box>
  )
}

export default AdminDashboard;