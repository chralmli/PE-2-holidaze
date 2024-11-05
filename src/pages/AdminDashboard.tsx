import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import VenueManagement from '../components/VenueManagement';
import UserBookings from '../components/UserBookings';
import UserProfile from './UserProfile';
import CreateVenueForm from '../components/CreateVenueForm';

const AdminDashboard: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // if the user is not logged in or not a venue manager, restrict access
  if (!isLoggedIn || !user?.venueManager) {
    return (
      <Box>
        <Typography variant="h5" sx={{ textAlign: 'center', marginTop: '20px' }}>Access Denied</Typography>
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
        Welcome, Venue Manager {user.name}
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