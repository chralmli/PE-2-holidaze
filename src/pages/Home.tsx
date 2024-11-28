/**
 * Home.tsx
 * 
 * A component that serves as the home page for the Holidaze booking platform.
 * Provides search functionality to find venues based on location, date range, and the number of guests.
 * Displays the most popular and best-rated venues.
 */

import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Tabs, Tab, Snackbar, Alert, Container, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import debounce from 'lodash/debounce';
import backgroundImage from '../assets/media/holidaze-backgorund.jpg';

// Components
import GuestCounter from '../components/GuestCounter';
import SuggestionsList from '../components/SuggestionsList';
import VenueList from '../components/VenueList';
import WhyBookWithUs from '../components/WhyBookWithUs';
import Testimonials from '../components/Testimonials';

// Services & Types
import api from '../services/api';
import { Venue } from '../types/Venue';

// Styles
import {
    StyledTextField,
} from '../assets/styles/HomeStyles';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

/**
 * TabPanel Component
 * 
 * A functional component for rendering the content of each tab.
 * 
 * @param {React.ReactNode} children - The content to be displayed in the tab.
 * @param {number} index - The index of the tab.
 * @param {number} value - The current selected tab index.
 * @returns {React.ReactElement} - The content if the tab is selected.
 */
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index} aria-labelledby={`venue-tab-${index}`}>
        {value === index && children}
    </div>
);

// Slider settings for the venue carousel
const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
        {
            breakpoint: 1080,
            settings: {
                slidesToShow: 2,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
            },
        },
    ],
};

/**
 * Home Component
 * 
 * A React functional component that serves as the landing page for the Holidaze platform.
 * Users can search for venues based on location, date, and the number of guests.
 * Popular and best-rated venues are displayed for easy browsing.
 * 
 * @component
 * @returns {React.ReactElement} - The home page of the application.
 */
const Home: React.FC = () => {
    // State management
    const [searchParams, setSearchParams] = useState({
        location: '',
        checkIn: null as Dayjs | null,
        checkOut: null as Dayjs | null,
        guests: 1,
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [bgImageLoaded, setBgImageLoaded] = useState<boolean>(false);
    const [loading, setLoading] = useState({
        venues: true,
        suggestions: false,
    });
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<Venue[]>([]);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [showError, setShowError] = useState<boolean>(false);

    const navigate = useNavigate();

    /**
     * Fetches venue suggestions based on user input for location.
     * Uses debounce to limit API calls while typing.
     * 
     * @param {string} query - The user input for location.
     */
    const fetchSuggestions = useCallback(
        debounce(async (query: string) => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(prev => ({ ...prev, suggestions: true }));
            try {
                const response = await api.get(`/holidaze/venues/search?q=${query}`);
                setSuggestions(response.data.data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setError('Failed to fetch suggestions');
                setShowError(true);
            } finally {
                setLoading(prev => ({ ...prev, suggestions: false }));
            }
        }, 300),
        []
    );

    /**
     * Fetches a list of venues from the API when the component mounts.
     * Handles loading and error states accordingly.
     */
    useEffect(() => {
        const fetchVenues = async () => {
            setLoading(prev => ({ ...prev, venues: true }));
            try {
                const response = await api.get('/holidaze/venues');
                setVenues(response.data.data);
            } catch (error) {
                console.error('Error fetching venues:', error);
                setError('Failed to fetch venues');
                setShowError(true);
            } finally {
                setLoading(prev => ({ ...prev, venues: false }));
            }
        };

        fetchVenues();
    }, []);

    // Fetch suggestions when location changes
    useEffect(() => {
        fetchSuggestions(searchParams.location);
    }, [searchParams.location, fetchSuggestions]);

    /**
     * Validates the selected check-in and check-out dates.
     * Ensures dates are valid and within acceptable ranges.
     * 
     * @returns {boolean} - True if dates are valid, otherwise false.
     */
    const validateDates = () => {
        if (!searchParams.checkIn || !searchParams.checkOut) {
            setError('Please select both check-in and check-out dates');
            setShowError(true);
            return false;
        }

        if (searchParams.checkOut.isBefore(searchParams.checkIn)) {
            setError('Check-out date must be after check-in date');
            setShowError(true);
            return false;
        }

        // Don't allow bookings more than a year in advance
        if (searchParams.checkIn.isAfter(dayjs().add(1, 'year'))) {
            setError('Bookings cannot be made more than a year in advance');
            setShowError(true);
            return false;
        }

        return true;
    };

    /**
     * Handles the search functionality.
     * Validates inputs and redirects the user to the venues page with the appropriate query parameters.
     */
    const handleSearch = () => {
        if ((searchParams.checkIn || searchParams.checkOut) && !validateDates()) return;

        const queryParams = new URLSearchParams({
            location: searchParams.location,
            guests: searchParams.guests.toString(),
            ...(searchParams.checkIn && { checkIn: searchParams.checkIn.format('YYYY-MM-DD') }),
            ...(searchParams.checkOut && { checkOut: searchParams.checkOut.format('YYYY-MM-DD') }),
        });
        navigate(`/venues?${queryParams.toString()}`);
    };

    /**
     * Handles input changes for the search form.
     * Updates the search parameters state.
     * 
     * @param {keyof typeof searchParams} field - The field being updated.
     * @param {any} value - The new value for the field.
     */
    const handleInputChange = (field: keyof typeof searchParams, value: any) => {
        setSearchParams(prev => ({...prev, [field]: value }));
    };

    useEffect(() => {
        const img = new Image();
        img.src = backgroundImage;
        img.onload = () => setBgImageLoaded(true);
        img.onerror = (e) => console.error('Failed to load background image:', e);
    }, []);

    return (
        <>
            <Helmet>
                <title>Holidaze - Your Travel Destination Guide</title>
                <meta name="description" content="Discover new destinations, book unique experiences, and enjoy the best of your travels." />
                <meta property="og:title" content="Holidaze - Your Travel Destination Guide" />
                <meta property="og:description" content="Discover new destinations, book unique experiences, and enjoy the best of your travels." />
                <meta property="og:image" content={backgroundImage} />
            </Helmet>
            <Box
                sx={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, #34e89e, #0f3443 100%)',
                    pt: { xs: 12, md: 20 },
                    pb: { xs: 10, md: 16 },
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        background: bgImageLoaded
                            ? `url(${backgroundImage}) center/cover`
                            : 'transparent',
                        opacity: 0.1,
                        zIndex: 0,
                    }
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography 
                        variant="h1" 
                        component="h1" 
                        sx={{ 
                            color: 'common.white', 
                            mb: { xs: 4, md: 8 }, 
                            textAlign: { xs: 'center', md: 'left' },
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        }}
                    >
                        Find your perfect getaway with holidaze
                    </Typography>

                    <Paper
                        elevation={3}
                        sx={{
                            p: { xs: 2, md: 3 },
                            borderRadius: '24px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: '1fr 1fr',
                                    md: '2fr 1fr 1fr 1fr'
                                },
                                gap: 3,
                            }}
                        >

                            {/* Location Search */}
                            <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.700' }}>
                                    Location
                                </Typography>
                                <Box sx={{ position: 'relative' }}>
                                    <StyledTextField
                                        fullWidth
                                        placeholder="Where are you going?"
                                        value={searchParams.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                            }
                                        }}
                                    />
                                    <SuggestionsList
                                        suggestions={suggestions}
                                        isLoading={loading.suggestions}
                                        searchTerm={searchParams.location}
                                        onSelectSuggestion={(venueName) => {
                                            handleInputChange('location', venueName);
                                            setSuggestions([]);
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* Date pickers */}
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.700' }}>
                                    Check-in
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                        label="Check-in"
                                        value={searchParams.checkIn}
                                        onChange={(newValue) => {
                                            handleInputChange('checkIn', newValue);
                                            // If check-out is before check-in, reset
                                            if (searchParams.checkOut && newValue && searchParams.checkOut.isBefore(newValue)) {
                                                handleInputChange('checkOut', null);
                                            }
                                        }}
                                        closeOnSelect
                                        disablePast
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                sx: {
                                                    '&. MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    }
                                                }
                                            },
                                        }} 
                                    />
                                </LocalizationProvider>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.700' }}>
                                    Check-out
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                        label="Check-out"
                                        value={searchParams.checkOut}
                                        onChange={(newValue) => handleInputChange('checkOut', newValue)}
                                        closeOnSelect
                                        disablePast
                                        minDate={searchParams.checkIn || undefined}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                sx: {
                                                    '&. MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    }
                                                }
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>

                            {/* Guest counter component */}
                            <Box 
                                sx={{ 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.700' }}>
                                        Guests
                                    </Typography>
                                    <GuestCounter
                                        guests={searchParams.guests}
                                        setGuests={(value) => handleInputChange('guests', value)}
                                        anchorEl={anchorEl}
                                        setAnchorEl={setAnchorEl}
                                    />
                                </Box>
                                {/* Search Button */}
                                <Button
                                    variant="contained"
                                    color="gradient"
                                    onClick={handleSearch}
                                    disabled={loading.venues}
                                    startIcon={<SearchIcon />}
                                    fullWidth
                                    sx={{
                                        height: '56px',
                                        mt: { xs: 2, md: 'auto' }
                                    }}
                                >
                                    Search
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>

            {/* Venues Section */}
            <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
                <Tabs
                    value={selectedTab}
                    onChange={(_, value) => setSelectedTab(value)}
                    centered
                    sx={{
                        mb: 4,
                        '& .MuiTab-root': {
                            fontSize: '1rem',
                            textTransform: 'none',
                            fontWeight: 500,
                            color: 'grey.700',
                            '&.Mui-selected': {
                                color: 'primary.main',
                            },
                        },
                        '& .MuiTabs-indicator': {
                            height: '3px',
                            borerRadius: '2px',
                            background: 'linear-gradient(135deg, #34e89e 0%, #34e89e 100%)',
                        },
                    }}
                >
                    <Tab label="Most popular venues" />
                    <Tab label="Best rated venues" />
                </Tabs>

                <Box sx={{ mt: 4 }}>
                    <TabPanel value={selectedTab} index={0}>
                        <VenueList
                            fetchMode="popular"
                            venues={venues}
                            isLoading={loading.venues}
                            onHover={() => {}}
                            hoveredVenueId={null}
                            useSlider
                        />
                    </TabPanel>

                    <TabPanel value={selectedTab} index={1}>
                        <VenueList
                            fetchMode="bestRated"
                            venues={venues}
                            isLoading={loading.venues}
                            onHover={() => {}}
                            hoveredVenueId={null}
                            useSlider
                        />
                    </TabPanel>
                </Box>
            </Container>
                

            <WhyBookWithUs />
            <Testimonials />

            <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={() => setShowError(false)}
            >
                <Alert
                    onClose={() => setShowError(false)}
                    severity="error"
                    variant="filled"
                    sx={{
                        borderRadius: '12px',
                        '& .MuiAlert-icon': {
                            fontSize: '24px'
                        }
                    }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};
        
export default Home;