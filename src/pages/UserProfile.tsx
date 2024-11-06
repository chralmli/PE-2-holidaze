import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, CircularProgress, Button } from '@mui/material';
import useUserProfile from '../hooks/useUserProfile';
import VenueCard from '../components/VenueCard';
import BookingCard from '../components/BookingCard';
import { useNavigate, useLocation } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const { profile, loading, error } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();

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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '12px' }}>
      <Avatar
        src={profile.avatar?.url}
        alt={profile.avatar?.alt || 'User avatar'}
        sx={{ width: 120, height: 120, border: '2px solid #ccc' }}
      />
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
          {profile.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {profile.email}
        </Typography>
        {profile.bio && (
          <Typography variant="body1" sx={{ marginTop: '12px', color: '#666' }}>
            {profile.bio}
          </Typography>
        )}
      </Box>
    </Box>

    {/* Banner section */}
    {profile.banner && (
      <Box sx={{ marginBottom: '32px' }}>
        <img
          src={profile.banner?.url}
          alt={profile.banner?.alt || 'User banner'}
          style={{ width: '100%', height: '250px', borderRadius: '12px', objectFit: 'cover' }}
        />
      </Box>
    )}

    {/* Venues section */}
    <Box sx={{ marginBottom: '40px'}}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '16px', color: '#333'}}>
        Your venues ({profile._count?.venues || 0})
      </Typography>
      {profile.venues && profile.venues.length === 0 ? (
        <Typography variant="body1" color="text.secondary">You have no venues listed</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {profile.venues?.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </Box>
      )}
    </Box>

    {/* Bookings section */}
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>
        Your bookings ({profile._count?.bookings || 0})
      </Typography>
      {profile.bookings && profile.bookings.length === 0 ? (
        <Typography variant="body1" color="text.secondary">You have no bookings yet.</Typography>
      ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {profile.bookings?.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={{
                ...booking,
                created: '',
                updated: '',
              }}
            />
          ))}
        </Box>
      )}
    </Box>

      {/* Admin dashboard access for venue managers */}
      {profile?.venueManager && location.pathname !== '/admin' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin')}
          sx={{ marginTop: '24px', display: 'block', width: '100%' }}
        >
          Go to Admin Dashboard
        </Button>
      )}
  </Box>
  );
};


export default UserProfile;