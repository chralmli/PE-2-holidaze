/**
 * AdminDashboard.tsx
 *
 * This component serves as the admin dashboard for venue managers.
 * It provides tabs to manage their profile, existing venues, and create new venues.
 */

import React, { useState, useEffect } from 'react';
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
const AdminDashboard: React.FC<{ profile: any }> = ({ profile: initialProfile }) => {
  const { profile: hookProfile, loading: profileLoading, error } = useUserProfile();
  const [tabIndex, setTabIndex] = useState(0);
  const activeProfile = initialProfile || hookProfile;

  useEffect(() => {
    if (activeProfile?.venueManager) {
      setTabIndex(0);
    }
  }, [activeProfile]);

  // Check loading
  if (profileLoading && !initialProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Check error
  if (error && !initialProfile) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <Typography variant="h5" color="error" sx={{ textAlign: 'center', marginTop: '20px' }}>Error</Typography>
        <Typography variant="body1">{error}</Typography>
      </Box>
    )
  }
  /**
   * Handles tab change events
   *
   * @param {React.SyntheticEvent} event - The tab change event.
   * @param {number} newValue - The index of the newly selected tab.
   */
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <UserProfile profile={activeProfile} />;
      case 1:
        return <VenueManagement />;
      case 2:
        return <CreateVenueForm />;
      default:
        return <UserProfile profile={activeProfile} />;
    }
  };

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
        Welcome, Venue Manager {activeProfile?.name}
      </Typography>

      {/* Tabs for venue manager */}
      <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Profile" />
        <Tab label="Manage Venues" />
        <Tab label="Create Venue" />
      </Tabs>

      {/* Render components based on selected tab */}
      <Box sx={{ mt: 2 }}>
        {renderTabContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;