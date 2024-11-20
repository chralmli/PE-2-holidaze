import React from 'react';
import { Box, Typography, Avatar, Button, styled } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

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

const ProfileContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  backgroundColor: '#f5f5f5',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}));

const BannerSection = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 200,
  backgroundColor: theme.palette.grey[300],
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
  position: 'relative',
}));

const ProfileContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, onEditProfile }) => {
  return (
    <ProfileContainer>
      <BannerSection
        role="img"
        aria-label={profile.banner?.alt || 'Profile banner'}
        sx={{
          backgroundImage: profile.banner?.url ? `url(${profile.banner.url})` : 'none'
        }}
      />

      <ProfileContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: { xs: 2, sm: 4 },
            position: 'relative',
            mt: { xs: -8, sm: -8 },
          }}
        >
          <Avatar
            src={profile.avatar?.url}
            alt={profile.avatar?.alt || `${profile.name}'s avatar`}
            sx={{ 
              width: { xs: 100, sm: 120 },
              height: { xs: 100, sm: 120 }, 
              border: '4px solid #fff',
              zIndex: 2,
            }}
          />

          {/* Profile information */}
          <Box
            sx={{
              flex: 1,
              textAlign: { xs: 'center', sm: 'left' },
              mt: { xs: 0, sm: 4 },
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#333',
                fontSize: { xs: '1.5rem', sm: '2rem' },
                mt: 2,
                mb: 1,
                }}
              >
              {profile.name}
            </Typography>

            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {profile.email}
            </Typography>

            {profile.bio && (
              <Typography 
                variant="body1" 
                sx={{
                  mb: 3,
                  color: '#666',
                  maxWidth: '600px', 
                  }}
                >
                {profile.bio}
              </Typography>
            )}
          </Box>

          {/* Edit button */}
          <Button
            variant="contained"
            color="primary"
            onClick={onEditProfile}
            startIcon={<EditIcon />}
            sx={{ 
              position: { xs: 'relative', sm: 'absolute' },
              top: { sm: 4 },
              right: { sm: 0 },
              background: 'linear-gradient(135deg, #34e89e, #0f3443)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0f3443, #34e89e)',
              },
            }}
          >
            Edit Profile
          </Button>
        </Box>
      </ProfileContent>
    </ProfileContainer>
  );
};


export default ProfileInfo;

