import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Tabs, Tab } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { Dayjs } from 'dayjs';
import { styled } from '@mui/system';
import Slider from 'react-slick';
import GuestCounter from '../components/GuestCounter';
import SuggestionsList from '../components/SuggestionsList';
import VenueList from '../components/VenueList';
import WhyBookWithUs from '../components/WhyBookWithUs';
import Testimonials from '../components/Testimonials';
import api from '../services/api';
import { Venue } from '../types/Venue';
import debounce from 'lodash/debounce';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Styled component for gradient background
const Background = styled(Box)({
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #34e89e, #0f3443)',
    padding: '20px',
    boxSizing: 'border-box',
});

// Styled container for heading and search
const ContentContainer = styled(Box)({
    width: '100%',
    maxWidth: '1200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
})

// Styled search container
const SearchContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    borderRadius: '50px',
    backgroundColor: '#ffffff',
    padding: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
    overflow: 'hidden',
    border: '3px solid #34e89e',
});

const theme = createTheme({
    components: {
        MuiInputBase: {
            styleOverrides: {
                root: {
                    "&:focus-within": {
                        backgroundColor: '#f0f0f0',
                    },
                },
            },
        },
    },
});

const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 900,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};


// Home Component
const Home: React.FC = () => {
    const [location, setLocation] = useState<string>("");
    const [date, setDate] = useState<Dayjs | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [guests, setGuests] = useState<number>(1);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<Venue[]>([]);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const navigate = useNavigate();

    const fetchSuggestions = debounce(async (query: string) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }
        setIsSuggestionsLoading(true);
        try {
            const response = await api.get(`/holidaze/venues/search?q=${query}`);
                setSuggestions(response.data.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setIsSuggestionsLoading(false);
        }
    }, 300);

    useEffect(() => {
        fetchSuggestions(location);
    }, [location]);

    // fetch venues from api
    useEffect(() => {
        const fetchVenues = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/holidaze/venues');
                setVenues(response.data.data);
            } catch (error) {
                console.error('Error fetching venues:', error);
                setError('Failed to fetch venues');
            } finally {
                setIsLoading(false);
            }
        };
        fetchVenues();
    }, []);

    const handleTabChange = (_: React.ChangeEvent<unknown>, newValue: number) => {
        setSelectedTab(newValue);
    };

    const handleSearch = () => {
        navigate(`/venues?location=${encodeURIComponent(location)}&guests=${guests}&date=${date?.format('YYYY-MM-DD')}`);
    };

    return (
        <>
            <Background>
                <ContentContainer>
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        mb={8}
                        gutterBottom 
                        sx={{ color: '#ffffff', fontFamily: 'poppins', fontWeight: '600', fontSize: '35px', textAlign: 'left', width: '100%' }}
                    >
                        Find your perfect getaway with holidaze
                    </Typography>
                    <SearchContainer>
                        <ThemeProvider theme={theme}>
                            <TextField 
                                label="Location"
                                variant="outlined" 
                                value={location} 
                                onChange={(e) => setLocation(e.target.value)} 
                                fullWidth 
                                sx={{ 
                                    marginRight: '8px', 
                                    backgroundColor: '#ffffff', 
                                    borderTopLeftRadius: '50px',
                                    borderBottomLeftRadius: '50px',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderTopLeftRadius: '50px',
                                            borderBottomLeftRadius: '50px',
                                            borderTopWidth: 0,
                                            borderLeftWidth: 0,
                                            borderBottomWidth: 0,
                                            borderRadius: 0,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'transparent',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'transparent',
                                        },
                                    },
                                }} 
                            />

                            {/* Suggestions list component */}
                            <SuggestionsList
                                suggestions={suggestions}
                                isLoading={isSuggestionsLoading}
                                onSelectSuggestion={(venueName: string) => {
                                    setLocation(venueName);
                                    setSuggestions([]);
                                }}
                            />

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDatePicker
                                    label="Anytime"
                                    value={date}
                                    onChange={(newValue) => setDate(newValue)}
                                    closeOnSelect={true}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            InputProps: {
                                                readOnly: true,
                                            },
                                            sx: {
                                                marginRight: '8px', 
                                                backgroundColor: '#ffffff',
                                                '& .MuiInputBase-input': {
                                                    cursor: 'pointer',
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderTopWidth: 0,
                                                        borderLeftWidth: 0,
                                                        borderBottomWidth: 0,
                                                        borderRadius: 0,
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'transparent',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'transparent',
                                                    },
                                                },
                                            }
                                        }
                                    }}
                                    disablePast // Prevent selecting past dates
                                />
                            </LocalizationProvider>

                            {/* Guest counter component */}
                            <GuestCounter
                                guests={guests}
                                setGuests={setGuests}
                                anchorEl={anchorEl}
                                setAnchorEl={setAnchorEl}
                            />
                        </ThemeProvider>
                        <Button 
                            variant="contained"
                            color="gradient"
                            size="large" 
                            sx={{ minWidth: '100px', borderRadius: '50px', padding: '14px', color: '#ffffff', fontSize: '16px', textTransform: 'capitalize' }}
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </SearchContainer>
                </ContentContainer>
            </Background>

            {/* Popular/Best Rated Venues Section */}
            <Box px={3} maxWidth="1200px" margin="auto" sx={{ marginTop: '20px' }}>
                <Tabs value={selectedTab} onChange={handleTabChange} centered>
                    <Tab label="Most popular venues" />
                    <Tab label="Best rated venues" />
                </Tabs>
                    <Slider {...sliderSettings}>
                        <VenueList
                            fetchMode={selectedTab === 0 ? "popular" : "bestRated"}
                            venues={venues}
                            isLoading={false}
                            onHover={() => {}}
                            hoveredVenueId={null}
                        />
                    </Slider>
            </Box>

            {/* Why Book with us section */}
            <WhyBookWithUs />

            {/* Testimonials section */}
            <Testimonials />

            {/* Footer */}
            
        </>
    );
};

export default Home;