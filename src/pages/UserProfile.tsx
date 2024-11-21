/**
 * UserProfile.tsx
 * 
 * A component that displays the user's profile, allowing the user to view and edit their information,
 * view their venues, bookings, and manage their venue dashboard.
 */

import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, Alert, Divider, Container, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import { Booking } from '../types/Booking';
import { Venue } from '../types/Venue';
import useUserProfile from '../hooks/useUserProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateUserProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';

// components
import VenueSection from '../components/VenueSection';
import BookingSection from '../components/BookingSection.tsx';
import EditProfileModal from '../components/EditProfileModal.tsx';
import ProfileInfo from '../components/ProfileInfo';

// Types

/**
 * ProfileUpdate
 * 
 * Interface for updating the user's profile data.
 * @typedef {Object} ProfileUpdate
 * @property {string} bio - The user's bio.
 * @property {string} avatarUrl - URL to the user's avatar image.
 * @property {string} bannerUrl - URL to the user's banner image.
 * @property {boolean} venueManager - Whether the user is a venue manager or not.
 */
interface ProfileUpdate {
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  venueManager: boolean;
}

/**
 * UserProfileData
 * 
 * Interface representing the user's complete profile data.
 * @typedef {Object} UserProfileData
 * @property {string} name - The user's name.
 * @property {string} email - The user's email.
 * @property {string} [bio] - The user's bio (optional).
 * @property {Object} [avatar] - Object containing avatar URL and alt text (optional).
 * @property {Object} [banner] - Object containing banner URL and alt text (optional).
 * @property {boolean} venueManager - Whether the user is a venue manager or not.
 * @property {Venue[]} venues - List of venues owned by the user.
 * @property {Booking[]} bookings - List of bookings made by the user.
 * @property {Object} [_count] - Object containing counts for venues and bookings (optional).
 */
interface UserProfileData {
  name: string;
  email: string;
  bio?: string;
  avatar?: { url: string; alt: string };
  banner?: { url: string; alt: string };
  venueManager: boolean;
  venues: Venue[];
  bookings: Booking[];
  _count?: {
    venues: number;
    bookings: number;
  };
}

// Styled components

/**
 * Styled container for the entire user profile.
 */
const ProfileContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '40px auto',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

/**
 * Styled card component for the user's profile section.
 */
const ProfileCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}));

/**
 * Styled section used in the user profile card.
 */
const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:not(:last-child)': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

/**
 * Styled button for accessing the user's dashboard.
 */
const DashboardButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #34e89e, #0f3443)',
  color: '#fff',
  padding: theme.spacing(1.5, 3),
  '&:hover': {
    background: 'linear-gradient(135deg, #0f3443, #34e89e)',
  },
}));

/**
 * UserProfile Component
 * 
 * A React functional component that displays the user profile page. It allows users to view and edit their profile information, see their venues and bookings, and access the venue manager dashboard if applicable.
 * 
 * @component
 * @returns {React.FC} - User profile page.
 */
const UserProfile: React.FC = () => {
  const { user, login } = useAuth();
  const { profile, loading, error } = useUserProfile();
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

    /**
   * Handle updating the user profile.
   * 
   * @param {ProfileUpdate} updates - The new profile data to be updated.
   * @returns {Promise<void>}
   */
  const handleUpdateProfile = useCallback(async (updates: ProfileUpdate) => {
    if (!user) return;
    
    try {
      setUpdating(true);
      setUpdateError(null);
      await updateUserProfile(user.name, updates);
      login({ ...user, ...updates });
      setEditProfileOpen(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
      setUpdateError('Failed to update user profile');
    } finally {
      setUpdating(false);
    }
  }, [user, login]);

  // Loading state
  if (loading) {
    return (
      <ProfileContainer>
        <ProfileCard>
          <Skeleton variant="rectangular" height={200} />
          <Box sx={{ p: 3 }}>
            <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        </ProfileCard>
      </ProfileContainer>
    );
  }
  
  // Error state
  if (error) {
    return (
      <ProfileContainer>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2}}>{error}</Alert>
      </ProfileContainer>
    );
  }

  // No profile found
  if (!profile) {
    return (
      <ProfileContainer>
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2, }}>
          Profile not found. Please try logging in again.
        </Alert>
      </ProfileContainer>
    );
  }

  // Render user profile
  return (
    <ProfileContainer>
      <ProfileCard>
        <Section>
          <ProfileInfo
            profile={profile as UserProfileData}
            onEditProfile={() => setEditProfileOpen(true)}
          />
        </Section>

        <Divider />

        <Section>
          <VenueSection
            venues={profile.venues}
            venueCount={profile._count?.venues || 0}
            isLoading={loading}
          />
        </Section>

        <Divider />

        <Section>
          <BookingSection
            bookings={profile.bookings}
            bookingCount={profile._count?.bookings || 0}
            isLoading={loading}
          />
        </Section>

        {location.pathname !== '/admin' && (
          <Section>
            {profile.venueManager ? (
              <Box>
                <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                  You are a venue manager. Access your management dashboard to handle your venues.
                </Typography>
                <DashboardButton
                  variant="contained"
                  startIcon={<DashboardIcon />}
                  onClick={() => navigate('/admin')}
                  fullWidth
                >
                  Open Admin Dashboard
                </DashboardButton>
              </Box>
            ) : (
              <Alert severity='info' sx={{ borderRadius: 2 }}>
                Interested in becoming a Venue Manager? Edit your profile to apply!
              </Alert>
            )}
          </Section>
        )}
      </ProfileCard>

      <EditProfileModal
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
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
    </ProfileContainer>
  );
};


export default UserProfile;