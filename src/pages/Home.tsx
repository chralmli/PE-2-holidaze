import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Tabs, Tab, Snackbar, Alert } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import debounce from 'lodash/debounce';

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
    StyledBackground,
    ContentContainer,
    SearchContainer,
    SearchWrapper,
    SearchBox,
    SearchButton,
    StyledTextField,
    DatePickerWrapper,
    GuestCounterWrapper,
    SearchButtonWrapper,
} from '../assets/styles/HomeStyles';

// Theme config
const theme = createTheme({
    components: {
        MuiInputBase: {
            styleOverrides: {
                root: {
                    transition: 'background-color 0.3s ease',
                    '&:focus-within': {
                        backgroundColor: '#f5f5f5',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '50px',
                    textTransform: 'none',
                },
            },
        },
    },
});

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index} aria-labelledby={`venue-tab-${index}`}>
        {value === index && children}
    </div>
);

const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
        {
            breakpoint: 960,
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


// Home Component
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
    const [loading, setLoading] = useState({
        venues: true,
        suggestions: false,
    });
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<Venue[]>([]);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [showError, setShowError] = useState<boolean>(false);

    const navigate = useNavigate();

    // Fetch suggestions with debounce
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

    // fetch venues
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

    // Search suggestions when location changes
    useEffect(() => {
        fetchSuggestions(searchParams.location);
    }, [searchParams.location, fetchSuggestions]);

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

        // Dont allow bookings more than a year in advance
        if (searchParams.checkIn.isAfter(dayjs().add(1, 'year'))) {
            setError('Bookings cannot be made more than a year in advance');
            setShowError(true);
            return false;
        }

        return true;
    };

    const handleSearch = () => {
        if (!validateDates()) return;

        const queryParams = new URLSearchParams({
            location: searchParams.location,
            guests: searchParams.guests.toString(),
            ...(searchParams.checkIn && { checkIn: searchParams.checkIn.format('YYYY-MM-DD') }),
            ...(searchParams.checkOut && { checkOut: searchParams.checkOut.format('YYYY-MM-DD') }),
        });
        navigate(`/venues?${queryParams.toString()}`);
    };

    const handleInputChange = (field: keyof typeof searchParams, value: any) => {
        setSearchParams(prev => ({...prev, [field]: value }));
    };

    return (
        <ThemeProvider theme={theme}>
            <StyledBackground>
                <ContentContainer>
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        sx={{ 
                            color: '#ffffff', 
                            fontFamily: 'Poppins, sans-serif', 
                            fontWeight: '600', 
                            fontSize: { xs: '28px', md: '35px' },
                            textAlign: { xs: 'center', md: 'left' },  
                            width: '100%',
                            mb: { xs: 4, md: 8 }, 
                        }}
                    >
                        Find your perfect getaway with holidaze
                    </Typography>

                    <SearchContainer>
                        <SearchWrapper>
                            <SearchBox>
                                <StyledTextField 
                                    label="Location"
                                    variant="outlined" 
                                    value={searchParams.location} 
                                    onChange={(e: any) => handleInputChange('location', e.target.value)} 
                                    fullWidth
                                />

                                {/* Suggestions list component */}
                                <SuggestionsList
                                    suggestions={suggestions}
                                    isLoading={loading.suggestions}
                                    onSelectSuggestion={(venueName) => {
                                        handleInputChange('location', venueName);
                                        setSuggestions([]);
                                    }}
                                />
                            </SearchBox>

                            <DatePickerWrapper>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                        sx={{ borderBottom: '1px solid rgba(0,0,0, 0.12)' }}
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
                                                placeholder: 'Add check-in date',
                                            },
                                        }} 
                                    />
                                    <MobileDatePicker
                                        sx={{ borderBottom: '1px solid rgba(0,0,0, 0.12)' }}
                                        label="Check-out"
                                        value={searchParams.checkOut}
                                        onChange={(newValue) => handleInputChange('checkOut', newValue)}
                                        closeOnSelect
                                        disablePast
                                        minDate={searchParams.checkIn || undefined}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                placeholder: 'Add check-out date',
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </DatePickerWrapper>

                            {/* Guest counter component */}
                            <GuestCounterWrapper>
                                <GuestCounter
                                    guests={searchParams.guests}
                                    setGuests={(value) => handleInputChange('guests', value)}
                                    anchorEl={anchorEl}
                                    setAnchorEl={setAnchorEl}
                                />
                            </GuestCounterWrapper>
                        </SearchWrapper>

                        <SearchButtonWrapper>
                            <SearchButton
                                variant="contained"
                                onClick={handleSearch}
                                disabled={loading.venues}
                                startIcon={<SearchIcon />}
                                sx={{
                                    height: '48px',
                                    minWidth: { xs: '100%', md: '120px' },
                                }}
                            >
                                Search
                            </SearchButton>
                        </SearchButtonWrapper>
                    </SearchContainer>
                </ContentContainer>
            </StyledBackground>

            <Box
                px={3}
                maxWidth="1200px"
                margin="auto"
                sx={{ mt: 4 }}
            >
                <Tabs
                    value={selectedTab}
                    onChange={(_, value) => setSelectedTab(value)}
                    centered
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#34e89e',
                        },
                    }}
                >
                    <Tab label="Most popular venues" />
                    <Tab label="Best rated venues" />
                </Tabs>

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
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
};
        
export default Home;