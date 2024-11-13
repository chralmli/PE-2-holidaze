import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Box, Grid, Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent, Alert, Pagination, Stack } from '@mui/material';
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
  const [loading, setLoading] = useState<boolean>(true);
  const [mapLoading, setMapLoading] = useState<boolean>(false);
  const [searchQueryState, setSearchQueryState] = useState<string>('');
  const [filterState, setFilterState] = useState<{ price: string; guests: string; rating: string; }>({
    price: 'any',
    guests: 'any',
    rating: 'any',
  });
  const [hoveredVenueId, setHoveredVenueId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Limit of venues per page
  const VENUES_PER_PAGE = 10;

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        let allFetchedVenues: Venue[] = [];
        let page = 1;

        // Keep fetching pages until we have enough valid venues
        while (true) {
        const response: VenueResponse = await getAllVenues(page, VENUES_PER_PAGE);
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
    if (mapRef.current) {
      mapRef.current.invalidateSize();
      handleMapUpdate();
    }
  }, [allVenues]);

  const handleSearch = (query: string) => {
    setSearchQueryState(query);
    setCurrentPage(1); // Reset pagination when searching
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFilterState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredVenues = useMemo(() => {
    return venuesInView.filter((venue) => {
      return (
        venue.name.toLowerCase().includes(searchQueryState.toLowerCase()) &&
        (filterState.price === 'any' || venue.price <= Number(filterState.price)) &&
        (filterState.guests === 'any' || venue.maxGuests >= Number(filterState.guests)) &&
        (filterState.rating === 'any' || (venue.rating ?? 0) >= Number(filterState.rating))
      )
    });
  }, [venuesInView, searchQueryState, filterState]);

  const venuesForCurrentPage = useMemo(() => {
    const startIndex = (currentPage - 1) * VENUES_PER_PAGE;
    const endIndex = startIndex + VENUES_PER_PAGE;
    return filteredVenues.slice(startIndex, endIndex);
  }, [filteredVenues, currentPage]);

  const handleHoverVenue = (venueId: string) => {
    setHoveredVenueId(venueId);
    const venue = allVenues.find((v) => v.id === venueId);

    if (venue && mapRef.current) {
      if (typeof venue.location?.lat === 'number' && typeof venue.location?.lng === 'number') {
        mapRef.current.flyTo([venue.location.lat, venue.location.lng], 13, { duration: 0.5 });
        setMapError(null);
      } else {
        // if latitude or longitude is missing, show an error message
        setMapError(`Could not find location for ${venue?.name}.`);
      }
    }
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

      map.on('moveend', handleMapUpdate);
      map.on('zoomend', handleMapUpdate);

      return () => {
        map.off('moveend', handleMapUpdate);
        map.off('zoomend', handleMapUpdate);
      };
    }, [map]);

    return null;
  };

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
              width: '50%',
              height: '100vh',
              overflowY: 'auto',
              padding: '20px',
              backgroundColor: '#f5f5f5',
            }}
          >
            <SearchBar onSearch={handleSearch} />
          
          {/* Filters section */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 3 }}>
            <FormControl variant="outlined">
              <InputLabel>Price</InputLabel>
              <Select label="Price" name="price" value={filterState.price} onChange={handleFilterChange}>
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="100">100 NOK</MenuItem>
                <MenuItem value="200">200 NOK</MenuItem>
                <MenuItem value="300">300 NOK</MenuItem>
                <MenuItem value="400">400 NOK</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel>Guests</InputLabel>
              <Select
                label="Guests"
                name="guests"
                value={filterState.guests}
                onChange={handleFilterChange}
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="8">8</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel>Rating</InputLabel>
              <Select
                label="Rating"
                name="rating"
                value={filterState.rating}
                onChange={handleFilterChange}
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {mapError && (
            <Alert severity="error" sx={{ mt: 2 }} onClose={() => setMapError(null)}>
              {mapError}
            </Alert>
          )}

          <Grid container spacing={3} sx= {{ mt: 3 }}>
            {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100&', mt: 4 }}>
              <CircularProgress />
            </Box>
           ) : venuesForCurrentPage.length > 0 ? (
                venuesForCurrentPage.map((venue, index) => (
                  <Grid item xs={12} sm={6} md={4} key={`${venue.id}-${index}`} onMouseEnter={() => handleHoverVenue(venue.id)} onMouseLeave={() => setHoveredVenueId(null)}>
                    <VenueCard venue={venue} />
                  </Grid>
                ))
              ) : (
                  <Typography variant="h6" color='textSecondary' sx={{ textAlign: 'center', mt: 4 }}>
                    No venues match your search or filters. Try modifying your criteria.
                  </Typography>
                )}
            </Grid>

            <Stack spacing={2} alignItems="center" mt={4}>
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
        </Box>

        {/* Map Section */}
        <Box 
          sx={{
            flex: 1, 
            position: 'sticky', 
            top: 0,
            width: { md: '50%', xs: '0'},
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
                          hoveredVenueId === venue.id ? '#34e89' : 'white'
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