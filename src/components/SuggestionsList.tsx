import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Venue } from '../types/Venue';

interface SuggestionsListProps {
  suggestions: Venue[];
  isLoading: boolean;
  onSelectSuggestion: (venueName: string) => void;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions, isLoading, onSelectSuggestion }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        width: '100%',
        backgroundColor: 'white',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
      }}
    >
      {isLoading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        suggestions.map((venue) => (
          <Box
            key={venue.id}
            p={1}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
            onClick={() => onSelectSuggestion(venue.name)}
          >
            <Typography>{`${venue.name}, ${venue.location?.city || 'Unknown City'}`}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

export default SuggestionsList;