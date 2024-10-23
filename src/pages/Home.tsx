import React from "react";
import { Box, Typography, TextField, Button, Popover, IconButton, CardMedia } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Venues from '../components/Venues';

// Styled component for gradient background
const Background = styled(Box)({
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // background: 'linear-gradient(135deg, #a2d9ff, #ffb3fd)',
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


// Home Component
const Home: React.FC = () => {
    const [location, setLocation] = React.useState<string>("");
    const [date, setDate] = React.useState<Dayjs | null>(null);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [adults, setAdults] = React.useState<number>(1);
    const [children, setChildren] = React.useState<number>(0);
    const [bedrooms, setBedrooms] = React.useState<number>(1);
    const [bathrooms, setBathrooms] = React.useState<number>(1);

    const handleGuestsClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleGuestsClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'guest-popover' : undefined;

    const handleSearch = () => {
        console.log('Searching for:', { location, date, adults, children, bedrooms, bathrooms });
    };

    // Calculate total number of guests
    const totalGuests = adults + children;
    const guestsLabel = `${totalGuests} guest${totalGuests > 1 ? 's' : ''}`;

    return (
        <>
            <Background>
                <ContentContainer>
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        mb={10}
                        gutterBottom 
                        sx={{ color: '#ffffff', fontFamily: 'poppins', fontWeight: '600', fontSize: '35px', textAlign: 'left', width: '100%' }}
                    >
                        Find your perfect getaway with holidaze
                    </Typography>
                    <SearchContainer>
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Anytime"
                                value={date}
                                onChange={(newValue) => setDate(newValue)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        onClick: (event) => {
                                            // Open calendar when clicking anywhere on the input
                                            const input = event.currentTarget.querySelector('input');
                                            if (input) {
                                                input.focus();
                                                input.click();
                                            }
                                        },
                                        sx: {
                                            marginRight: '8px', 
                                            backgroundColor: '#ffffff',
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

                        <TextField 
                            label="Guests" 
                            variant="outlined" 
                            value={guestsLabel}
                            onClick={handleGuestsClick}
                            fullWidth 
                            sx={{ 
                                marginRight: '8px', 
                                backgroundColor: '#ffffff',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none',
                                    },
                                },
                            }} 
                        />
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleGuestsClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <Box p={2}>
                                {[
                                    { label: "Adults", value: adults, setValue: setAdults },
                                    { label: "Children", value: children, setValue: setChildren },
                                    { label: "Bedrooms", value: bedrooms, setValue: setBedrooms },
                                    { label: "Bathrooms", value: bathrooms, setValue: setBathrooms },
                                ].map(({ label, value, setValue }) => (
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} key={label}>
                                        <Typography>{label}</Typography>
                                        <Box>
                                            <IconButton onClick={() => setValue(value > 0 ? value - 1 : 0)}>
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography display="inline" mx={1}>{value}</Typography>
                                            <IconButton onClick={() => setValue(value + 1)}>
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Popover>

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
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%" mt={5}>
                <Venues limit={12} />
            </Box>
        </>
    );
};

export default Home;