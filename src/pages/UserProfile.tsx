import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/userService';
import { UserProfileResponse } from '../types/User';
import VenueCard from '../components/VenueCard';
import BookingCard from '../components/BookingCard';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileResponse['data'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        console.warn('No user is currently logged in');
        return;
      }
      try {
        setLoading(true);
        console.log('Fetching user profile with name:', user.name);
        const token = user.accessToken;
        console.log('Token being user:', token);

        // Fetch profile data for the current logged-in user
        const response = await getUserProfile(user.name);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
    }
  };
  
  fetchUserProfile();
}, [user]);

if (loading) {
  return <CircularProgress />;
}

if (!profile) {
  return <Typography variant="body1">User profile not found.</Typography>;
}

return (
  <Box sx={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
      <Avatar
        src={profile.avatar?.url}
        alt={profile.avatar?.alt || 'User avatar'}
        sx={{ width: 100, height: 100 }}
      />
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {profile.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {profile.email}
        </Typography>
        {profile.bio && (
          <Typography variant="body1" sx={{ marginTop: '8px' }}>
            {profile.bio}
          </Typography>
        )}
      </Box>
    </Box>

    {profile.banner && (
      <img
        src={profile.banner?.url}
        alt={profile.banner?.alt || 'User banner'}
        style={{ width: '100%', height: '300px', borderRadius: '10px', marginBottom: '32px', objectFit: 'cover' }}
      />
    )}

    <Box sx={{ marginBottom: '32px'}}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '16px'}}>
        Your venues ({profile._count?.venues || 0})
      </Typography>
      {profile.venues && profile.venues.length === 0 ? (
        <Typography variant="body1">You have no venues listed</Typography>
      ): (
        profile.venues?.map((venue) => <VenueCard key={venue.id} venue={venue} />)
      )}
    </Box>

    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
        Your bookings ({profile._count?.bookings || 0})
      </Typography>
      {profile.bookings && profile.bookings.length === 0 ? (
        <Typography variant="body1">You have no bookings yet.</Typography>
      ) : (
        profile.bookings?.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={{
            ...booking,
            created: '',
            updated: ''
          }}
        />
        ))
      )}
    </Box>
  </Box>
  ); 
};

export default UserProfile;