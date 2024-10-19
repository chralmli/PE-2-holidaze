import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/system';

// Styled component for gradient background
const Background = styled(Box)({
    height: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #a2d9ff, #ffb3fd)',
});

// Home Component
const Home: React.FC = () => {
    const [location, setLocation] = React.useState("");
    const [date, setDate] = React.useState("");
    const [guests, setGuests] = React.useState("");

    const handleSearch = () => {
        console.log('Searching for:', { location, date, guests });
    };

    return (
        <Background>
            <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                Find Your Perfect Getaway With Holidaze
            </Typography>
            <Box mt={4} width={{ xs: '90%', sm: '70%', md: '50%' }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid xs={12} md={6} component="div">
                        <TextField
                            label="Location"
                            variant="outlined"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            fullWidth
                            sx={{ backgroundColor: '#ffffff' }}
                        />
                    </Grid>
                    <Grid mobile={12} tablet={6} desktop={4} component="div">
                        <TextField
                            label="Date"
                            type="date"
                            variant="outlined"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            fullWidth
                            sx={{ backgroundColor: '#ffffff' }}
                        />
                    </Grid>
                    <Grid mobile={12} tablet={6} desktop={4} component="div">
                        <TextField
                            label="Number of Guests"
                            variant="outlined"
                            fullWidth
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            sx={{ backgroundColor: '#ffffff' }}
                        />
                    </Grid>
                    <Grid xs={12} sm={6} md={3} component="div">
                        <Button onClick={handleSearch} variant="contained" color="primary" fullWidth sx={{ height: '100%' }}>
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Background>
    );
};

export default Home;