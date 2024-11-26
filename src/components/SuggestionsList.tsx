import React from 'react';
import { Box, Typography, CircularProgress, Paper, List, ListItem, ListItemText, ListItemIcon, Fade, Chip, Divider, NoSsr } from '@mui/material';
import { LocationOn, Search as SearchIcon, TrendingUp as TrendingIcon, History as HistoryIcon, } from '@mui/icons-material';
import { Venue } from '../types/Venue';

interface SuggestionsListProps {
  suggestions: Venue[];
  isLoading: boolean;
  onSelectSuggestion: (venueName: string) => void;
  searchTerm?: string;
  recentSearches?: string[];
  trendingLocations?: string[];
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ 
  suggestions, 
  isLoading, 
  onSelectSuggestion,
  searchTerm = '',
  recentSearches = [],
  trendingLocations = [], 
}) => {
  const hasResults = suggestions.length > 0;
  const showRecentSearches = !searchTerm && recentSearches.length > 0;
  const showTrending = !searchTerm && trendingLocations.length > 0;

  const highlightMatch = (text: string) => {
    if (!searchTerm) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <Box
          component="span"
          key={index}
          sx={{
            color: 'primary.main',
            fontWeight: 600,
          }}
        >
          {part}
        </Box>
      ) : part
    );
  };

  return (
    <Fade in={isLoading || hasResults || showRecentSearches || showTrending}>
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          width: '100%',
          maxHeight: '25vh',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.100',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          zIndex: 1400,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{
          overflow: 'auto',
          '&: :-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}>
            <NoSsr>
            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={3}
              >
                <CircularProgress size={24} />
              </Box>
            ) : (
              <List sx={{ py: 0 }}>
                {/* Search results */}
                {hasResults && (
                  <>
                    <ListItem sx={{ py: 1, px: 2 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <SearchIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="caption" color="text.secondary">
                            SEARCH RESULTS
                          </Typography>
                        }
                      />
                    </ListItem>
                    {suggestions.map((venue, index) => (
                      <React.Fragment key={venue.id}>
                        <ListItem
                          component="div"
                          onClick={() => onSelectSuggestion(venue.name)}
                          sx={{
                            py: 2,
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'grey.50',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <LocationOn
                              fontSize="small"
                              sx={{ color: 'secondary.main' }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={highlightMatch(venue.name)}
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {venue.location?.city || 'Unknown City'}
                                  {venue.location?.country && `, ${venue.location.country}`}
                                </Typography>
                                {venue.rating && (
                                  <Chip
                                    label={`${venue.rating.toFixed(1)} ★`}
                                    size="small"
                                    sx={{
                                      height: 20,
                                      backgroundColor: 'primary.50',
                                      color: 'primary.main',
                                      fontWeight: 600,
                                    }}
                                  />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < suggestions.length - 1 && (
                          <Divider component="li" />
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}

                {/* Recent Searches */}
                {showRecentSearches && (
                  <>
                    <ListItem sx={{ py: 1, px: 2 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <HistoryIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="caption" color="text.secondary">
                            RECENT SEARCHES
                          </Typography>
                        }
                      />
                    </ListItem>
                    {recentSearches.map((search, index) => (
                      <React.Fragment key={search}>
                        <ListItem
                          component="div"
                          onClick={() => onSelectSuggestion(search)}
                          sx={{
                            py: 1.5,
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'grey.50',
                            },
                          }}
                        >
                          <ListItemText
                            primary={search}
                            sx={{ pl: 4.5 }}
                          />
                        </ListItem>
                        {index < recentSearches.length - 1 && (
                          <Divider component="li" />
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}

                {/* Trending Locations */}
                {showTrending && (
                  <>
                    <ListItem sx={{ py: 1, px: 2 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <TrendingIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="caption" color="text.secondary">
                            TRENDING LOCATIONS
                          </Typography>
                        }
                      />
                    </ListItem>
                    {trendingLocations.map((location, index) => (
                      <React.Fragment key={location}>
                        <ListItem
                          component="div"
                          onClick={() => onSelectSuggestion(location)}
                          sx={{
                            py: 1.5,
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'grey.50',
                            },
                          }}
                        >
                          <ListItemText
                            primary={location}
                            sx={{ pl: 4.5 }}
                          />
                        </ListItem>
                        {index < trendingLocations.length - 1 && (
                          <Divider component="li" />
                        )}
                      </React.Fragment>
                    ))}
                  </>
                  )}

                  {/* No results */}
                  {searchTerm && !hasResults && !isLoading && (
                    <ListItem sx={{ py: 3 }}>
                      <ListItemText
                        sx={{ textAlign: 'center' }}
                        primary={
                          <Typography variant="body1" color="text.secondary">
                            No results found for "{searchTerm}".
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}
              </List>
            )}
          </NoSsr>
        </Box>
      </Paper>
    </Fade>    
  );
};

export default SuggestionsList;