import React,{ useEffect, useState } from "react";
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
 * Interface for filter state
 * @interface
 */
interface FilterState {
  price: string;
  guests: string;
  rating: string;
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
}

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
  const filteredVenues = isLoading ? [] : venuesInView.filter((venue) => {
    return (
      venue.name.toLowerCase().includes('') &&
      (filterState.price === 'any' || venue.price <= Number(filterState.price)) &&
      (filterState.guests === 'any' || venue.maxGuests >= Number(filterState.guests)) &&
      (filterState.rating === 'any' || (venue.rating ?? 0) >= Number(filterState.rating)) &&
      (!filterState.wifi ||  venue.meta?.wifi) &&
      (!filterState.parking || venue.meta?.parking) &&
      (!filterState.breakfast || venue.meta?.breakfast) &&
      (!filterState.pets || venue.meta?.pets)
    );
  });


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
  const handleMapUpdate = (bounds: L.LatLngBounds) => {
    if (!bounds) return;

    setIsLoading(true);

    const venuesInBounds = allVenues.filter(
      (venue) =>
        venue.location &&
      typeof venue.location.lat === 'number' &&
      typeof venue.location.lng === 'number' &&
      bounds.contains([venue.location.lat, venue.location.lng])
    );

    setVenuesInView(venuesInBounds);
    setIsLoading(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Venue Cards Section */}
      <Box sx={{ width: { lg: '60%', sm: '100%'}, height: '100vh', overflowY: 'auto', padding: '20px', backgroundColor: '#f5f5f5', }}>
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            maxWidth: '100%',
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
        
          <VenueList 
            venues={filteredVenues.slice((currentPage - 1) * VENUES_PER_PAGE, currentPage * VENUES_PER_PAGE)} 
            isLoading={isLoading} 
            onHover={setHoveredVenueId} 
            hoveredVenueId={hoveredVenueId} 
            useSlider={false}
          />
        
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
          width: { md: '40%', sm: '0'},
          zIndex: 1,
          display: { xs: 'none', md: 'block' },
        }}
      >
        <MapSection venues={allVenues} hoveredVenueId={hoveredVenueId} mapLoading={isLoading} onMapUpdate={handleMapUpdate} />
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
          },
        }}
      >
        <MapSection venues={allVenues} hoveredVenueId={hoveredVenueId} mapLoading={isLoading} onMapUpdate={handleMapUpdate} />
      </Drawer>
    </Box>
  );
};

export default VenuesPage;