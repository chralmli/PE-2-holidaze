import React from 'react';
import { Box, Typography, Grid, Skeleton, Alert } from '@mui/material';
import { styled, SxProps, Theme } from '@mui/material/styles';
import VenueCard from './VenueCard';
import { Venue } from '../types/Venue';
import { Home as HomeIcon } from '@mui/icons-material';

interface VenueSectionProps {
  venues?: Venue[];
  venueCount?: number;
  isLoading?: boolean;
  error?: string | null;
  isManagerView?: boolean;
  onEdit?: (venueId: string) => void;
  sx?: SxProps<Theme>;
}

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const EmptyStateBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius * 1.5,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const VenueSection: React.FC<VenueSectionProps> = ({ venues, venueCount, isLoading = false, error = null, }) => {
  if (isLoading) {
    return (
      <SectionContainer>
        <SectionHeader>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Your venues
          </Typography>
        </SectionHeader>
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
              <Skeleton
                variant="rectangular"
                height={350}
                sx={{
                  borderRadius: 2,
                  transform: 'scale(1, 0.8)',
                  transformOrigin: 'top',
                }}
              />
            </Grid>
          ))}
        </Grid>
      </SectionContainer>
    );
  }

  if (error) {
    return (
      <SectionContainer>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Your venues ({venueCount})
        </Typography>
      </SectionHeader>

      {(!venues || venues.length === 0) ? (
        <EmptyStateBox>
          <HomeIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
          <Typography variant="body1" color="text.secondary">
            You haven' listed any  venues yet.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start managing properties by becoming a venue manager
          </Typography>
        </EmptyStateBox>
        ) : (
          <Grid
            container
            spacing={3}
            sx={{
              '& .MuiGrid-item': {
                display: 'flex',
              },
            }}
          >
            {venues.map((venue) => (
              <Grid item xs={12} sm={6} md={4} key={venue.id}>
                <VenueCard 
                  venue={venue} 
                  isManagerView 
                  sx={{ width: '100%' }}
                />
              </Grid>
            ))}
          </Grid>
        )}
    </SectionContainer>
  )
};

export default VenueSection;