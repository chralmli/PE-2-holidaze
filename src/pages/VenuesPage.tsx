import React, { useEffect, useState, useRef } from 'react';
import { Box, Grid, Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent, Alert } from '@mui/material';
import SearchBar from '../components/SearchBar';
import VenueCard from '../components/VenueCard';
import { getAllVenues } from '../services/venueService';
import { Venue } from '../types/Venue';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple } from 'leaflet';
import { useInView } from 'react-intersection-observer';

const VenuesPage: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCriteria, setFilterCriteria] = useState({ price: 'any', guests: 'any', rating: 'any' });
  const [hoveredVenueId, setHoveredVenueId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Intersection observer to handle infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1
  });

  // Limit of venues per page
  const VENUES_PER_PAGE = 10;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const venuesData = await getAllVenues(currentPage, VENUES_PER_PAGE);
        if (venuesData.length < VENUES_PER_PAGE) {
          setHasMore(false);
        }
        if (currentPage === 1) {
          setVenues(venuesData);
        } else {
          setVenues((prev) => [...prev, ...venuesData]);
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [currentPage]);

  // Setup the map reference when the map is ready
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [venues]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [inView, hasMore, loading]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset pagination when searching
    setVenues([]); // Clear current results
  };

  const applyFilters = () => {
    const filtered = venues.filter((venue) => {
      return (
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterCriteria.price === 'any' || venue.price <= Number(filterCriteria.price)) &&
        (filterCriteria.guests === 'any' || venue.maxGuests >= Number(filterCriteria.guests)) &&
        (filterCriteria.rating === 'any' || (venue.rating?? 0) >= Number(filterCriteria.rating))
      )
    });
    setFilteredVenues(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [venues, searchQuery, filterCriteria]);

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFilterCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHoverVenue = (venueId: string) => {
    setHoveredVenueId(venueId);
    const venue = venues.find((v) => v.id === venueId);

    if (venue && mapRef.current) {
      if (typeof venue?.location.lat === 'number' && typeof venue.location.lng === 'number') {
          mapRef.current.flyTo([venue.location.lat, venue.location.lng], 13, { duration: 0.5 });
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
      console.warn(`Venue with id ${venueId} has invalid location data:`, venue?.location);
      }
      setMapError(`Could not find location for ${venue?.name}. Please try again later.`);
    }
  };

  const handleMapUpdate = () => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();

    // filter the venues based on whether they fall within the map bounds
    const filteredVenuesByBounds = venues.filter((venue) => {
      if (venue.location && typeof venue.location.lat === 'number' && typeof venue.location.lng === 'number') {
        // check if the latitude and longitude are within the bounds of the visible map
        return bounds.contains([venue.location.lat, venue.location.lng]);
      }
      return false;
    });

    // update the filtered venues state and set an error message if necessary
    setFilteredVenues(filteredVenuesByBounds);
    if (filteredVenuesByBounds.length === 0) {
      setMapError('No venues found within the visible map area. Try zooming out or panning the map.');
    } else {
      setMapError(null);
    }
  };

  const MapEventsHandler = () => {
    const map = useMap();

    // Assign the map instance to the ref on initialization
    useEffect(() => {
      if (map && !mapRef.current) {
        mapRef.current = map;
      }
    }, [map]);

    // Register move and zoom events
    useEffect(() => {
      map.on('move', handleMapUpdate);
      map.on('zoom', handleMapUpdate);

      return () => {
        map.off('move', handleMapUpdate);
        map.off('zoom', handleMapUpdate);
      };
    }, [map]);

    return null;
  };

  const getVenueCoordinates = (venue: Venue): LatLngTuple => {
    if (venue.location && typeof venue.location.lat === 'number' && typeof venue.location.lng === 'number') {
      return [venue.location.lat, venue.location.lng];
    }
    // fallback to a default location if lat/lng are not available
    return [63.4305, 10.3951]; // Default to Trondheim, Norway
  };

  const filteredVenuesWithLocation = filteredVenues.filter(
    (venue) =>
      venue.location &&
      typeof venue.location.lat === 'number' &&
      typeof venue.location.lng === 'number'
    );

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
              <Select label="Price" name="price" value={filterCriteria.price} onChange={handleFilterChange}>
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
                value={filterCriteria.guests}
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
                value={filterCriteria.rating}
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
            {filteredVenues.length > 0 ? (
            filteredVenues.map((venue, index) => (
              <Grid item xs={12} sm={6} md={4} key={`${venue.id}-${index}`} onMouseEnter={() => handleHoverVenue(venue.id)} onMouseLeave={() => setHoveredVenueId(null)}>
                <VenueCard venue={venue} />
                {!venue.location?.lat || !venue.location?.lng ? (
                  <Typography variant="body2" color="textSecondary">
                    Location information not available.
                  </Typography>
                  ) : null}
              </Grid>
              ))
            ) : (
              !loading && (
                <Typography variant="h6" color='textSecondary' sx={{ textAlign: 'center', mt: 4 }}>
                  No venues found. Please try again later.
                </Typography>
              )
            )}
          </Grid>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          <Box ref={loadMoreRef} display="flex" justifyContent="center" mt={4}>
            {loading ? <CircularProgress /> : null}
          </Box>
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
            style={{ height: '100%', width: '100%' }}
          >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapEventsHandler />
              {filteredVenuesWithLocation.map((venue) => (
                  <Marker
                    key={venue.id}
                    position={getVenueCoordinates(venue)}
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
              ))}
            </MapContainer>
          </Box>
      </Box>
    );
};

export default VenuesPage;