import React from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';

interface Profile {
  name: string;
  email: string;
  bio?: string;
  avatar?: {
    url: string;
    alt?: string;
  };
  banner?: {
    url: string;
    alt?: string;
  };
}

interface ProfileInfoProps {
  profile: Profile,
  onEditProfile: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, onEditProfile }) => (
  <Box sx={{ marginBottom: '32px', alignItems: 'center', gap: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>

    {/* Banner section */}
    {profile.banner && (
      <Box
        sx={{
          width: '100%',
          height: '200px',
          backgroundImage: `url(${profile.banner.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 1
        }}
        role="img"
        aria-label={profile.banner.alt || 'User banner'}
      />
    )}

    {/* Avatar overlapping the banner */}
    <Box sx={{ padding: '24px', position: 'relative' }}>
      <Avatar
        src={profile.avatar?.url}
        alt={profile.avatar?.alt || 'User avatar'}
        sx={{ 
          width: 120, 
          height: 120, 
          border: '4px solid #fff', 
          position: 'absolute',
          top: '-60px',
          left: '24px',
          zIndex: 2,
        }}
      />

       {/* Profile information */}
      <Box sx={{ marginLeft: '160px', marginTop: '40px' }}>
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
        <Button
          variant="contained"
          color="primary"
          onClick={onEditProfile}
          sx={{ marginTop: '16px' }}
        >
          Edit Profile
        </Button>
      </Box>
    </Box>
</Box>
);

export default ProfileInfo;

