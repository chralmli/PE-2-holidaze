import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import useUserProfile from '../hooks/useUserProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateUserProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import VenueSection from '../components/VenueSection';
import BookingSection from '../components/BookingSection.tsx';
import EditProfileModal from '../components/EditProfileModal.tsx';
import ProfileInfo from '../components/ProfileInfo';

const UserProfile: React.FC = () => {
  const { user, login } = useAuth();
  const { profile, loading, error } = useUserProfile();
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handlers for edit profile modal
  const handleOpenEditProfile = () => setEditProfileOpen(true);
  const handleCloseEditProfile = () => setEditProfileOpen(false);

  const handleUpdateProfile = async (updates: { bio: string; avatarUrl: string; bannerUrl: string; venueManager: boolean }) => {
    if (!user) return;

    try {
      setUpdating(true);
      setUpdateError(null);

      // Update user profile
      await updateUserProfile(user.name, updates);

      // update the Auth context and localStorage
      login({ ...user, ...updates });

      handleCloseEditProfile();
    } catch (error) {
      console.error('Error updating user profile:', error);
      setUpdateError('Failed to update user profile');
    } finally {
      setUpdating(false);
    }
  };

if (loading) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
}

if (error) {
  return (
    <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
      <Typography variant="body1" color="error">{error}</Typography>
    </Box>
  )
}

if (!profile) {
  return (
    <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
      <Typography variant="body1">User profile not found.</Typography>
    </Box>
  );
}

return (
  <Box sx={{ maxWidth: '1200px', margin: '40px auto', padding: '24px', boxShadow: '0 4px 12px rgba(0, 0, 0,  0.1)', borderRadius: '12px', backgroundColor: '#fff' }}>
    {/* User info section */}
    <ProfileInfo profile={profile} onEditProfile={handleOpenEditProfile} />

    {/* Edit profile modal */}
    <EditProfileModal
      open={editProfileOpen}
      onClose={handleCloseEditProfile}
      onUpdate={handleUpdateProfile}
      updating={updating}
      updateError={updateError}
      initialValues={{
        bio: profile.bio || '',
        avatarUrl: profile.avatar?.url || '',
        bannerUrl: profile.banner?.url || '',
        venueManager: profile.venueManager || false,
      }}
    />
    
      {/* Venues section */}
      <VenueSection venues={profile.venues} venueCount={profile._count?.venues || 0} />

      {/* Bookings section */}
      <BookingSection bookings={profile.bookings} bookingCount={profile._count?.bookings || 0} />


      {/* Admin dashboard access
      {profile?.venueManager && location.pathname !== '/admin' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin')}
          sx={{ marginTop: '24px', display: 'block', width: '100%' }}
        >
          Go to Admin Dashboard
        </Button>
      )} */}

      {/* admin dashboard access */}
      {location.pathname !== '/admin' && (
        <>
          {profile.venueManager ? (
            <Box sx={{ marginTop: '24px' }}>
              <Typography variant="body1" color="text.primary" sx={{ marginBottom: 1 }}>
                You are a venue manager. Manage your venues from the admin dashboard.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/admin')}
                sx={{ display: 'block', width: '100%' }}
              >
                Go to Admin Dashboard
              </Button>
            </Box>
          ) : (
            <Box sx={{ marginTop: '24px' }}>
              <Typography variant='body1' color="text.secondary">
                Interested in becoming a Venue Manager? Edit your profile to apply!
              </Typography>
            </Box>
          )}
        </>
      )}
  </Box>
  );
};


export default UserProfile;