import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Box, Grid, Typography, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, FormControlLabel, MenuItem, Select, FormControl, InputLabel, Alert, Pagination, Stack, Drawer, IconButton } from '@mui/material';
import SearchBar from '../components/SearchBar';
import VenueCard from '../components/VenueCard';
import { getAllVenues } from '../services/venueService';
import { Venue, VenueResponse } from '../types/Venue';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import L, { LatLngTuple } from 'leaflet';
import debounce from 'lodash/debounce';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import RefreshIcon from '@mui/icons-material/Refresh';

const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Infokapsel')) {
    return;
  }
  originalConsoleWarn(...args);
}

const VenuesPage: React.FC = () => {
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [venuesInView, setVenuesInView] = useState<Venue[]>([]);
  const [mapFilteredVenues, setMapFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mapLoading, setMapLoading] = useState<boolean>(false);
  const [searchQueryState, setSearchQueryState] = useState<string>('');
  const [filterState, setFilterState] = useState<{ price: string; guests: string; rating: string; wifi: boolean; parking: boolean; breakfast: boolean; pets: boolean; }>({
    price: 'any',
    guests: 'any',
    rating: 'any',
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });
  const [hoveredVenueId, setHoveredVenueId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [mapError, setMapError] = useState<string | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [filterByMap, setFilterByMap] = useState<boolean>(!isSmallScreen);
  const [mapDrawerOpen, setMapDrawerOpen] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Limit of venues per page
  const VENUES_PER_PAGE = 15;

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // update filterByMap state based on screen size
  useEffect(() => {
    if (!isSmallScreen) {
      setFilterByMap(true);
    }
  }, [isSmallScreen]);

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        let allFetchedVenues: Venue[] = [];
        let page = 1;

        // Keep fetching pages until we have enough valid venues
        while (true) {
        const response: VenueResponse = await getAllVenues(page, VENUES_PER_PAGE, { _owner: true, _bookings: true});
        const { data, meta } = response;

        allFetchedVenues = [...allFetchedVenues, ...data];

        if (meta.isLastPage) {
          break;
        }
        page += 1;
      }

      setAllVenues(allFetchedVenues);
      setVenuesInView(allFetchedVenues);
      setTotalPages(Math.ceil(allFetchedVenues.length / VENUES_PER_PAGE));
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Setup the map reference when the map is ready
  useEffect(() => {
    if (mapDrawerOpen && mapRef.current) {
      setFilterByMap(true);
      setTimeout(() => {
        mapRef.current!.invalidateSize();
        handleMapUpdate();
      }, 300);
    } else if (!mapDrawerOpen && filterByMap) {
      // Keep showing the filtered venues when the drawer closes
      setVenuesInView(mapFilteredVenues);
    } 
  }, [mapDrawerOpen]);

  const handleSearch = (query: string) => {
    setSearchQueryState(query);
    setCurrentPage(1); // Reset pagination when searching
  };

  const filteredVenues = useMemo(() => {
    return venuesInView.filter((venue) => {
      return (
        venue.name.toLowerCase().includes(searchQueryState.toLowerCase()) &&
        (filterState.price === 'any' || venue.price <= Number(filterState.price)) &&
        (filterState.guests === 'any' || venue.maxGuests >= Number(filterState.guests)) &&
        (filterState.rating === 'any' || (venue.rating ?? 0) >= Number(filterState.rating)) &&
        (!filterState.wifi || venue.meta?.wifi) &&
        (!filterState.parking || venue.meta?.parking) &&
        (!filterState.breakfast || venue.meta?.breakfast) &&
        (!filterState.pets || venue.meta?.pets)
      );
    });
  }, [venuesInView, searchQueryState, filterState]);

  const venuesForCurrentPage = useMemo(() => {
    const startIndex = (currentPage - 1) * VENUES_PER_PAGE;
    const endIndex = startIndex + VENUES_PER_PAGE;
    return filteredVenues.slice(startIndex, endIndex);
  }, [filteredVenues, currentPage]);

  // Determine if pagination should be displayed
  const shouldShowPagination = filteredVenues.length > VENUES_PER_PAGE;

  // Filter modal handling
  const handleOpenFilterModal = () => {
    setFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setFilterModalOpen(false);
    // setFilterState({ price: 'any', guests: 'any', rating: 'any', wifi: false, parking: false, breakfast: false, pets: false });
  };

  const handleApplyFilters = () => {
    handleCloseFilterModal();
    setCurrentPage(1);
  };

  const handleHoverVenue = (venueId: string) => {
    setHoveredVenueId(venueId);
  };

  const handleMapUpdate = debounce(() => {
    if (!mapRef.current) return;


    setMapLoading(true);
    const bounds = mapRef.current.getBounds();
    const venuesInBounds = allVenues.filter(
      (venue) =>
        venue.location &&
        typeof venue.location.lat === 'number' &&
        typeof venue.location.lng === 'number' &&
        bounds.contains([venue.location.lat, venue.location.lng] as LatLngTuple)
    );

    setMapFilteredVenues(venuesInBounds);
    setVenuesInView(venuesInBounds);

    setMapLoading(false);
  }, 300);

  // Map events handlers to fetch venues dynamically as the map moves or zooms
  const MapEventsHandler = () => {
    const map = useMap();

    useEffect(() => {
      if (map && !mapRef.current) {
        mapRef.current = map;
        map.invalidateSize();
      }

      if (filterByMap) {
        map.on('moveend', handleMapUpdate);
        map.on('zoomend', handleMapUpdate);
      }

      return () => {
        map.off('moveend', handleMapUpdate);
        map.off('zoomend', handleMapUpdate);
      };
    }, [map, filterByMap]);

    return null;
  };

  const handleResetFilters = () => {
    // Reset to all venues, disable map filtering
    setVenuesInView(allVenues);
    setFilterByMap(false);
  };

  // Invalidate map size and update venues when the drawer opens
  useEffect(() => {
    if (mapDrawerOpen && mapRef.current) {
      setTimeout(() => {
        mapRef.current!.invalidateSize();
        handleMapUpdate();
      }, 300);
    }
  }, [mapDrawerOpen])

  const getVenueCoordinates = (venue: Venue): LatLngTuple | null => {
    if (venue.location && typeof venue.location.lat === 'number' && typeof venue.location.lng === 'number') {
      return [venue.location.lat, venue.location.lng];
    }
    return null; // Default to Trondheim, Norway
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };


    return (
      <Box sx={{ display: 'flex', height: '100vh' }}>
          {/* Venue Cards Section */}
          <Box 
            sx={{
              width: { md: '60%', xs: '100%'},  
              height: '100vh',
              overflowY: 'auto',
              padding: '20px',
              backgroundColor: '#f5f5f5',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <SearchBar onSearch={handleSearch} />

              {/* Open filter Modal Button */}
              <Button 
                variant="outlined" 
                onClick={handleOpenFilterModal} 
                sx={{ 
                  height: '56px',
                  minWidth: '100px',
                  mt: 2
                }}
              >
                Filters
              </Button>
            </Box>
            
            {/* Filter modal */}
            <Dialog open={filterModalOpen} onClose={handleCloseFilterModal}>
              <DialogTitle>Filter Venues</DialogTitle>
              <DialogContent>
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                  <InputLabel>Price</InputLabel>
                  <Select label="Price" name="price" value={filterState.price} onChange={(e) => setFilterState(prev => ({ ...prev, price: e.target.value }))}>
                    <MenuItem value="any">Any</MenuItem>
                    <MenuItem value="100">100 NOK</MenuItem>
                    <MenuItem value="200">200 NOK</MenuItem>
                    <MenuItem value="300">300 NOK</MenuItem>
                    <MenuItem value="400">400 NOK</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                  <InputLabel>Guests</InputLabel>
                  <Select 
                    label="Guests"
                    name="guests"
                    value={filterState.guests}
                    onChange={(e) => setFilterState(prev => ({ ...prev, guests: e.target.value }))}
                  >
                    <MenuItem value="any">Any</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                    <MenuItem value="6">6</MenuItem>
                    <MenuItem value="8">8</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                  <InputLabel>Rating</InputLabel>
                  <Select 
                    label="Rating"
                    name="rating"
                    value={filterState.rating}
                    onChange={(e) => setFilterState(prev => ({ ...prev, rating: e.target.value }))}
                  >
                    <MenuItem value="any">Any</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                    <MenuItem value="5">5</MenuItem>
                  </Select>
                </FormControl>

                {/* Meta options */}
                <FormControlLabel
                  control={<Checkbox checked={filterState.wifi} onChange={(e) => setFilterState(prev => ({ ...prev, wifi: e.target.checked }))} />}
                  label="Wifi"
                />
                <FormControlLabel
                  control={<Checkbox checked={filterState.parking} onChange={(e) => setFilterState(prev => ({ ...prev, parking: e.target.checked }))} />}
                  label="Parking"
                />
                <FormControlLabel
                  control={<Checkbox checked={filterState.breakfast} onChange={(e) => setFilterState(prev => ({ ...prev, breakfast: e.target.checked }))} />}
                  label="Breakfast"
                />
                <FormControlLabel
                  control={<Checkbox checked={filterState.pets} onChange={(e) => setFilterState(prev => ({ ...prev, pets: e.target.checked }))} />}
                  label="Pets"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseFilterModal}>Cancel</Button>
                <Button onClick={handleApplyFilters} color="primary">Apply</Button>
              </DialogActions>
            </Dialog>

          {mapError && (
            <Alert severity="error" sx={{ mt: 2 }} onClose={() => setMapError(null)}>
              {mapError}
            </Alert>
          )}

          <Grid container spacing={3} sx= {{ mt: 3 }}>
            {loading ? (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center', 
                width: '100%',
                height: '50vh', 
              }}
            >
              <CircularProgress />
            </Box>
           ) : venuesForCurrentPage.length > 0 ? (
                venuesForCurrentPage.map((venue, index) => (
                  <Grid item xs={12} sm={6} md={4} key={`${venue.id}-${index}`} onMouseEnter={() => handleHoverVenue(venue.id)} onMouseLeave={() => setHoveredVenueId(null)}>
                    <VenueCard venue={venue} />
                  </Grid>
                ))
              ) : (
                  <Typography variant="h6" color='textSecondary' sx={{ textAlign: 'center', mt: 4, ml: 4 }}>
                    No venues match your search or filters. Try modifying your criteria.
                  </Typography>
                )}
            </Grid>

            {shouldShowPagination && (
              <Stack spacing={2} alignItems="center" mt={4}>
                <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
              </Stack>
            )}
        </Box>

        {/* Sticky section at the bottom of the page on small screens */}
        {isSmallScreen && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              width: '100%',
              bgcolor: 'background.paper',
              boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
              padding: '8px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 1300,
            }}
          >
            {filterByMap && (
              <Button
                variant="contained" 
                color="primary" 
                onClick={handleResetFilters}
                startIcon={<RefreshIcon />}
                sx={{
                  height: '40px',
                  minWidth: 'auto',
                  px: 2,
                  fontSize: '0.875rem',
                  bgcolor: '#ff7043',
                  '&:hover': {
                    bgcolor: '#ff5722',
                  },
                }}
              >
                Clear Map Selection
              </Button>
            )}

            {/* Map drawer button */}
            {isSmallScreen && (
              <IconButton
                color="secondary"
                onClick={() => setMapDrawerOpen(true)}
                sx={{
                  height: '40px',
                  width: '40px',
                  px: 2,
                  fontSize: '0.875rem',
                  bgcolor: '#42a5f5',
                  '&:hover': {
                    bgcolor: '#1e88e5',
                  },
                }}
              >
                <MapRoundedIcon />
              </IconButton>
            )}
          </Box>
        )}
          
        {/* Map drawer */}
        <Drawer
          anchor="bottom"
          open={mapDrawerOpen}
          onClose={() => setMapDrawerOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              height: '60vh',
              width: '100%',
            },
          }}
        >
          <MapContainer
            center={[63.4305, 10.3951]}
            zoom={5}
            minZoom={4}
            maxZoom={16}
            style={{ height: '100%', width: '100%' }}
            ref={(mapInstance: L.Map) => {
              if (mapInstance && mapRef.current !== mapInstance) {
                mapRef.current = mapInstance;
                setTimeout(() => {
                  mapRef.current?.invalidateSize();
                  handleMapUpdate();
                }, 300);
              }
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup>
              {venuesInView.map((venue: Venue) => {
                const coordinates = getVenueCoordinates(venue);
                if (!coordinates) return null;
                
                return (
                  <Marker
                    key={venue.id}
                    position={coordinates}
                    icon={L.divIcon({
                      className: 'custom-div-icon',
                      html: `<div style="background: ${
                        hoveredVenueId === venue.id ? '#34e89e' : 'white'
                      }; padding: 5px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
                                  <span style="font-weight: bold;">${venue.price.toLocaleString('no-NO')} NOK</span>
                            </div>`,
                      iconSize: [50, 50],
                    })}
                  >
                    <Popup>
                      <Typography variant="body2" fontWeight="bold">
                        {venue.name}
                      </Typography>
                      <Typography variant="body2">
                        {venue.location.city || "Unknown City"}, {venue.location.country || "Unknown Country"}
                      </Typography>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
            <MapEventsHandler />
          </MapContainer>
        </Drawer>

        {/* Map Section (desktop) */}
        <Box 
          sx={{
            flex: 1, 
            position: 'sticky', 
            top: 0,
            width: { md: '40%', xs: '0'},
            zIndex: 1,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <MapContainer
            center={[63.4305, 10.3951]}
            zoom={5}
            minZoom={4}
            maxZoom={16}
            maxBounds={[
              [-85, -180],
              [85, 180],
            ]}
            maxBoundsViscosity={1.0}
            style={{ height: '100%', width: '100%' }}
          >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MarkerClusterGroup>
                {venuesInView.map((venue: Venue) => {
                  const coordinates = getVenueCoordinates(venue);
                  if (!coordinates) return null;
                  
                  return (
                    <Marker
                      key={venue.id}
                      position={coordinates}
                      icon={L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style="background: ${
                          hoveredVenueId === venue.id ? '#34e89e' : 'white'
                        }; padding: 5px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
                                  <span style="font-weight: bold;">${venue.price.toLocaleString('no-NO')} NOK</span>
                            </div>`,
                        iconSize: [50, 50],
                      })}
                    >
                      <Popup>
                        <Typography variant="body2" fontWeight="bold">
                          {venue.name}
                        </Typography>
                        <Typography variant="body2">
                          {venue.location.city || "Unknown City"}, {venue.location.country || "Unknown Country"}
                        </Typography>
                      </Popup>
                    </Marker>
                  );
                })}
              </MarkerClusterGroup>
              {mapLoading && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '10px',
                    borderRadius: '10px',
                  }}
                  >
                  <CircularProgress />
                </div>
              )}
              <MapEventsHandler />
            </MapContainer>
          </Box>
      </Box>
    );
};

export default VenuesPage;