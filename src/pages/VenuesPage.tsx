import React,{ useEffect, useState, useMemo, useCallback } from "react";
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { Box, Button, IconButton, Stack, Pagination, Drawer } from '@mui/material';
import SearchBar from '../components/SearchBar';
import VenueList from '../components/VenueList';
import FilterModal from '../components/FilterModal';
import MapSection from '../components/MapSection';
import { getAllVenues } from '../services/venueService';
import { Venue } from '../types/Venue';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import { FilterList as FilterIcon } from '@mui/icons-material';
import L from 'leaflet';

/**
 * VenuesPage Component
 * Displays a list of venues with filtering, search, and map functionality
 * Features responsive design with a map drawer for mobile views
 * 
 * @component
 * @example
 * ```tsx
 * <VenuesPage />
 * ```
 */
const VenuesPage: React.FC = () => {
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [venuesInView, setVenuesInView] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hoveredVenueId, setHoveredVenueId] = useState<string | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth < 768);
  const [mapDrawerOpen, setMapDrawerOpen] = useState<boolean>(false);
  const [mapState, setMapState] = useState<{
    bounds: L.LatLngBounds | null;
    center: L.LatLng | null;
    zoom: Number;
  }>({
    bounds: null,
    center: null,
    zoom: 5,
  });
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [filterState, setFilterState] = useState({
    price: 'any',
    guests: 'any',
    rating: 'any',
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });

  /** Number of venues to display per page */
   const VENUES_PER_PAGE = 15;

    /** Effect to handle search parameters from URL */
   useEffect(() => {
    const location = params.get('location')?.toLowerCase() || '';
    const guests = params.get('guests') || 'any';

    // set filterState based on query params
    setFilterState((prev) => ({ 
      ...prev, 
      guests: guests, 
    }));

    /**
   * Filters venues based on current filter state
   * @type {Venue[]}
   */
    const filteredVenues = allVenues.filter((venue) => {
      return (
        venue.name.toLowerCase().includes(location) &&
        (guests === 'any' || venue.maxGuests >= parseInt(guests, 10))
      );
    });

    setVenuesInView(filteredVenues);
   }, [search, allVenues]);

  /** Effect to handle screen resize events */
   useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
   }, []);

   /** Effect to fetch initial venues data */
   useEffect(() => {
    const fetchVenues = async () => {
      setIsLoading(true);
      try {
        const response = await getAllVenues(1, VENUES_PER_PAGE * 10, { _owner: true, _bookings: true });
        setAllVenues(response.data);
        setVenuesInView(response.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

    /**
   * Handles search functionality
   * Filters venues based on name, city, or country
   * @param {string} query - Search query string
   */
  const handleSearch = (query: string) => {
    setIsLoading(true);
    const searchTerm = query.toLowerCase();
    const searchedVenues = allVenues.filter((venue) => (
      venue.name.toLowerCase().includes(searchTerm) ||
      venue.location.city?.toLowerCase().includes(searchTerm) ||
      venue.location.country?.toLowerCase().includes(searchTerm)
    ));

    setVenuesInView(searchedVenues);
    setCurrentPage(1);
    setIsLoading(false);
  };

  // filter the venues according to filter settings
  const filteredVenues = useMemo(() => {
    if (isLoading) return [];
    return venuesInView.filter((venue) => {
      const matchesSearch = venue.name.toLowerCase().includes('');
      const matchesPrice = filterState.price === 'any' || venue.price <= Number(filterState.price);
      const matchesGuests = filterState.guests === 'any' || venue.maxGuests >= Number(filterState.guests);
      const matchesRating = filterState.rating === 'any' || (venue.rating ?? 0) >= Number(filterState.rating);
      const matchesFacilities = (
        (!filterState.wifi || venue.meta?.wifi) &&
        (!filterState.parking || venue.meta?.parking) &&
        (!filterState.breakfast || venue.meta?.breakfast) &&
        (!filterState.pets || venue.meta?.pets)
      );

      return matchesSearch && matchesPrice && matchesGuests && matchesRating && matchesFacilities;
    });
  }, [venuesInView, filterState, isLoading]);

  /**
   * Handles pagination page changes
   * @param {React.ChangeEvent<unknown>} _ - Event object (unused)
   * @param {number} value - New page number
   */
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };


  const handleOpenFilterModal = () => setFilterModalOpen(true);
  const handleCloseFilterModal = () => setFilterModalOpen(false);
  
  /**
   * Updates venues in view based on map bounds
   * Called when map is panned or zoomed
   * @param {L.LatLngBounds} bounds - Current map bounds
   */
  const handleMapUpdate = useCallback(async (
    bounds: L.LatLngBounds,
    center: L.LatLng,
    zoom: number
  ) => {
    if (!bounds) return;

    setMapState({ bounds, center, zoom });
    setIsMapLoading(true);

    try {
      if (zoom >= 5) {
        const venuesInBounds = allVenues.filter(venue => {
          if (!venue.location?.lat || !venue.location?.lng) return false;

          const isInBounds = bounds.contains([venue.location.lat, venue.location.lng]);
          const isWithinDistance = true;

          return isInBounds && isWithinDistance;
        });

        setVenuesInView(venuesInBounds);
      } else {
        setVenuesInView(allVenues);
      }
    } catch (error) {
      console.error('Error updating venues based on map:', error);
    } finally {
      setIsMapLoading(false);
    }
  }, [allVenues]);

  // Effect to handle initial venue loading
  useEffect(() => {
    const loadVenues = async () => {
      setIsLoading(true);
      try {
        const response = await getAllVenues(1, VENUES_PER_PAGE * 10, { _owner: true, _bookings: true });

        // Filer out venues without valid coordinates
        const validVenues = response.data.filter(
          venue => venue.location?.lat && venue.location?.lng
        );

        setAllVenues(validVenues);
        setVenuesInView(validVenues);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVenues();
  }, []);

    //  useEffect to prevent scroll on map container
    useEffect(() => {
      const preventScroll = (e: WheelEvent) => {
        if (e.target instanceof Element &&
          (e.target.closest('.leaflet-container') ||
           e.target.classList.contains('leaflet-container'))) {
            e.preventDefault();
           }
        };
  
        // Add event listener with passive: false to allow preventDefault()
        window.addEventListener('wheel', preventScroll, { passive: false });
  
        return () => {
          window.removeEventListener('wheel', preventScroll);
        };
    }, []);

  return (
    <>
      <Helmet>
        <meta property="og:title" content="Explore Stunning Venues with Holidaze - Book Your Perfect Stay" />
        <meta property="og:description" content="Discover unique venues for your next getaway with Holidaze. Browse a curated list of beautiful accommodations, see their locations on the map, and book your perfect stay effortlessly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://holidaze-stays.netlify.app/venues" />
      </Helmet>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Venue Cards Section */}
        <Box 
          sx={{ 
            width: { 
              xs: '100%',
              md: '65%',
              lg: '60%',
            }, 
            height: '100vh', 
            overflowY: 'auto', 
            padding: {
              xs: '20px 10px',
              sm: '20px',
            },
            backgroundColor: '#f5f5f5',
            margin: '0 auto',
        }}>
          {/* Search and flter section */}
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              maxWidth: {
                xs: '100%',
                sm: '600px',
                md: '100%'
              },
              gap: 2,
              mb: 3,
              px: { xs: 1, sm: 2 },
              mx: 'auto',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <SearchBar
                onSearch={handleSearch}
                isLoading={isLoading}
                autoSearch
                placeholder="Search by name, city, or country..."
              />
            </Box>
            
            <Button 
              variant="outlined" 
              onClick={handleOpenFilterModal}
              startIcon={<FilterIcon />}
              sx={{
                height: '56px',
                borderRadius: '24px',
                borderColor: '#34e89e',
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 2,
                width: { xs: '48px', sm: 'auto' },
                minWidth: { xs: '48px', sm: '100px' },
                padding: { xs: '0', sm: '0 16px' },
                '& .MuiButton-startIcon': {
                  margin: { xs: 0, sm: '0, 8px 0 -4px' },
                },
                '&:hover': {
                  borderColor: '#0f3443',
                  backgroundColor: '#f5f5f5',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                },
                '& .MuiSvgIcon-root': {
                  fonSize: '1.2rem',
                },
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                Filters
              </Box>
            </Button>
          </Box>
          <FilterModal open={filterModalOpen} filterState={filterState} onClose={handleCloseFilterModal} onApply={handleCloseFilterModal} setFilterState={setFilterState} />
          <Box sx={{
            maxWidth: {
              xs: '100%',
              sm: '600px',
              md: '100%'
            },
            mx: 'auto'
          }}>
            <VenueList 
              venues={filteredVenues.slice((currentPage - 1) * VENUES_PER_PAGE, currentPage * VENUES_PER_PAGE)} 
              isLoading={isLoading} 
              onHover={setHoveredVenueId} 
              hoveredVenueId={hoveredVenueId} 
              useSlider={false}
            />
          </Box>
            
          
          <Stack spacing={2} alignItems="center" mt={4}>
            <Pagination count={Math.ceil(filteredVenues.length / VENUES_PER_PAGE)} page={currentPage} onChange={handlePageChange} />
          </Stack>
        </Box>

        {/* Map Section */}
        <Box
          sx={{
            flex: 1,
            position: 'sticky',
            top: 0,
            width: { 
              md: '35%', 
              lg: '40%'
            },
            zIndex: 1,
            display: { xs: 'none', md: 'block' },
            '& .leaflet-container': {
              height: '100vh !important',
              position: 'sticky !important',
              top: 0,
              // Ensure map controls are always visible
              '& .leaflet-control-container': {
                position: 'fixed',
                zIndex: 1000,
              },
              userSelect: 'none',
            },
          }}
        >
          <MapSection venues={allVenues} hoveredVenueId={hoveredVenueId} mapLoading={isLoading} mapState={mapState} isMapLoading={isMapLoading} onMapUpdate={handleMapUpdate} />
        </Box>

        {/* Sticky section at the bottom of the page on small screens */}
        {isSmallScreen && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              width: '100%',
              padding: '8px 20px',
              bgcolor: 'background.paper',
              boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              zIndex: 1300,
            }}
          >
            <IconButton 
              color="secondary" 
              onClick={() => setMapDrawerOpen(true)}
              sx={{
                height: '40px',
                width: '40px',
                px: 2,
                fontSize: '0.875rem',
                backgroundColor: '#34e89e',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#0f3443',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                },
              }}
              >
              <MapRoundedIcon />
            </IconButton>
          </Box>
        )}

        {/* Map Drawer for small screens */}
        <Drawer
          anchor="bottom"
          open={mapDrawerOpen}
          onClose={() => setMapDrawerOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              height: '60vh',
              width: '100%',
              '& .leaflet-container': {
                height: '100% !important',
                // Ensure map controls are visible in drawer
                '& .leaflet-control-container': {
                  position: 'absolute',
                  zIndex: 1000,
                },
              },
            },
          }}
        >
          <MapSection venues={allVenues} hoveredVenueId={hoveredVenueId} mapLoading={isLoading} onMapUpdate={handleMapUpdate} />
        </Drawer>
      </Box>
    </>
  );
};

export default VenuesPage;