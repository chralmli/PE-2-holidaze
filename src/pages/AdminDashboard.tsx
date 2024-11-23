/**
 * AdminDashboard.tsx
 *
 * This component serves as the admin dashboard for venue managers.
 * It provides tabs to manage their profile, existing venues, and create new venues.
 */

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, CircularProgress } from '@mui/material';
import useUserProfile from '../hooks/useUserProfile';
import VenueManagement from '../components/VenueManagement';
import UserProfile from './UserProfile';
import CreateVenueForm from '../components/CreateVenueForm';

/**
 * AdminDashboard Component
 *
 * This component is used to manage venue manager functionalities in the application.
 * The admin dashboard provides three main tabs: Profile, Manage Venues, and Create Venue.
 * Users can manage their profile information, edit and manage existing venues, or create new venues.
 *
 * @component
 * @returns {React.ReactElement} - Admin dashboard for venue management.
 */
const AdminDashboard: React.FC = () => {
  const { profile, loading: profileLoading, error } = useUserProfile();
  const [tabIndex, setTabIndex] = useState(0);

  /**
   * Handles tab change events
   *
   * @param {React.SyntheticEvent} event - The tab change event.
   * @param {number} newValue - The index of the newly selected tab.
   */
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
        minHeight: 'calc(100vh - 64px)',
        maxWidth: '1200px',
        margin: '40px auto',
        padding: { xs: '10px', md: '20px' },
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
        <Tab label="Create Venue" />
      </Tabs>

      {/* Render components based on selected tab */}
      {tabIndex === 0 && <UserProfile />}
      {tabIndex === 1 && <VenueManagement />}
      {tabIndex === 2 && <CreateVenueForm />}
    </Box>
  )
}

export default AdminDashboard;