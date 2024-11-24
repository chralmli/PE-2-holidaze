import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography,
  Alert,
  Grid, 
  Paper, 
  Divider,
  InputAdornment, 
  Container, 
  CircularProgress 
} from '@mui/material';
import {
  Wifi, 
  LocalParking, 
  FreeBreakfast, 
  Pets,
  LocationOn, 
  Image, 
  Info, 
  Add as AddIcon 
} from '@mui/icons-material';
import { createVenue } from '../services/venueService';

interface FormValues {
  name: string;
  description: string;
  price: string;
  maxGuests: string;
  location: {
    address: string;
    city: string;
    zip: string;
    country: string;
    continent: string;
    latitude: string;
    longitude: string;
  };
  media: {
    url: string;
    alt: string;
  }
  amenities: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
}

const CreateVenueForm: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    description: '',
    price: '',
    maxGuests: '',
    location: {
      address: '',
      city: '',
      zip: '',
      country: '',
      continent: '',
      latitude: '',
      longitude: '',
    },
    media: {
      url: '',
      alt: '',
    },
    amenities: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (field: keyof FormValues['location'], value: string) => {
    setFormValues((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleMediaChange = (field: keyof FormValues['media'], value: string) => {
    setFormValues((prev) => ({
      ...prev,
      media: {
       ...prev.media,
        [field]: value,
      },
    }));
  };

  const handleAmenityChange = (field: keyof FormValues['amenities'], value: boolean) => {
    setFormValues((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [field]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    if (!formValues.name || !formValues.description || !formValues.price || !formValues.maxGuests) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields (venue name, description, price, max guests)',
      });
      return false;
    }

    if (Number(formValues.price) <= 0) {
      setMessage({
        type: 'error',
        text: 'Price must be greater than 0',
      });
      return false;
    }

    if (Number(formValues.maxGuests) <= 0) {
      setMessage({
        type: 'error',
        text: 'Maximum number of guests must be greater than 0',
      });
      return false;
    }

    return true;
  };

  const handleCreateVenue = async () => {
    if(!validateForm()) return;

    try {
      setLoading(true);
      const venueData = {
        name: formValues.name,
        description: formValues.description,
        price: Number(formValues.price),
        maxGuests: Number(formValues.maxGuests),
        media: [
          {
            url: formValues.media.url,
            alt: formValues.media.alt,
          },
        ],
        meta: formValues.amenities,
        location: {
          ...formValues.location,
          lat: formValues.location.latitude ? Number(formValues.location.latitude) : 0,
          lng: formValues.location.longitude ? Number(formValues.location.longitude) : 0,
        },
      };

      await createVenue(venueData);
      setMessage({ type: 'success', text: 'Venue created successfully!' });

      // Clear form after successful creation
      setFormValues({
        name: '',
        description: '',
        price: '',
        maxGuests: '',
        location: {
          address: '',
          city: '',
          zip: '',
          country: '',
          continent: '',
          latitude: '',
          longitude: '',
        },
        media: {
          url: '',
          alt: '',
        },
        amenities: {
          wifi: false,
          parking: false,
          breakfast: false,
          pets: false,
        },
      });
    } catch (error) {
      console.error('Error creating venue:', error);
      setMessage({ type: 'error', text: 'Failed to create venue. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

return (
  <Container maxWidth="md">
    <Paper
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 4,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: 'grey.100',
        mb: 4,
      }}
  >
    <Typography 
      variant="h4" 
      sx={{ 
        mb: 4, 
        background: 'linear-gradient(135deg, #34e89e, #0f3443)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 700,
      }}
    >
      Create a new venue
    </Typography>

    {message &&  (
      <Alert 
        severity={message.type} 
        onClose={() => setMessage(null)} 
        sx={{ 
          mb: 4,
          borderRadius: 2,
          '& .MuiAlert-icon': {
            alignItems: 'center'
          }
        }}
      >
        {message.text}
      </Alert>
    )}

    {/* Basic information section */}
    <Box sx={{ mb: 6 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          mb: 3,
          color: 'primary.main',
          fontWeight: 600,
        }}
      >
        <Info /> Basic Information
      </Typography>

      <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Venue Name"
              value={formValues.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={formValues.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
            InputProps={{
              sx: { borderRadius: 2 }
            }}
            placeholder="Describe your venue in detail..."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Price per night"
            type="number"
            value={formValues.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">NOK</InputAdornment>,
              inputProps: { min: 0 },
              sx: { borderRadius: 2 }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Max guests"
            type="number"
            value={formValues.maxGuests}
            onChange={(e) => handleInputChange('maxGuests', e.target.value)}
            required
            InputProps={{ 
              inputProps: { min: 1 },
              sx: { borderRadius: 2 }
            }}
          />
        </Grid>
      </Grid>
    </Box>

    <Divider sx={{ my: 4 }} />

    {/* Location Section */}
    <Box sx={{ mb: 6 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          mb: 3,
          color: 'primary.main',
          fontWeight: 600,
        }}
      >
        <LocationOn /> Location Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            value={formValues.location.address}
            onChange={(e) => handleLocationChange('address', e.target.value)}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={formValues.location.city}
            onChange={(e) => handleLocationChange('city', e.target.value)}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="ZIP"
            value={formValues.location.zip}
            onChange={(e) => handleLocationChange('zip', e.target.value)}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            value={formValues.location.country}
            onChange={(e) => handleLocationChange('country', e.target.value)}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Continent"
            value={formValues.location.continent}
            onChange={(e) => handleLocationChange('continent', e.target.value)}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Latitude"
            type="number"
            value={formValues.location.latitude}
            onChange={(e) => handleLocationChange('latitude', e.target.value)}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Longitude"
            type="number"
            value={formValues.location.longitude}
            onChange={(e) => handleLocationChange('longitude', e.target.value)}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
        </Grid>
      </Grid>
    </Box>

    <Divider sx={{ my: 4 }} />

    {/* Media section */}
    <Box sx={{ mb: 6 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3,
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}
      >
        <Image /> Media
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Image URL"
            value={formValues.media.url}
            onChange={(e) => handleMediaChange('url', e.target.value)}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
            placeholder="Enter the URL of your venue image"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Image Description"
            value={formValues.media.alt}
            onChange={(e) => handleMediaChange('alt', e.target.value)}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
            placeholder="Describe your image for accessibility"
          />
        </Grid>
      </Grid>
    </Box>

    <Divider sx={{ my: 4 }} />

    <Box sx={{ mb: 6 }}>
      <Typography 
        variant="h6"
        sx={{
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          mb: 3,
          color: 'primary.main',
          fontWeight: 600,
        }}
      >
        Amenities
      </Typography>

      <Grid container spacing={2}>
        {[
          { key: 'wifi', icon: Wifi, label: 'Wifi' },
          { key: 'parking', icon: LocalParking, label: 'Parking' },
          { key: 'breakfast', icon: FreeBreakfast, label: 'Breakfast' },
          { key: 'pets', icon: Pets, label: 'Pets Allowed' },
        ].map(({ key, icon: Icon, label }) => (
          <Grid item xs={6} sm={3} key={key}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: formValues.amenities[key as keyof typeof formValues.amenities]
                  ? 'secondary.main'
                  : 'grey.200',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    transform: 'translateY(-2px)',
                  },
              }}
              onClick={() => handleAmenityChange(
                key as keyof typeof formValues.amenities,
                !formValues.amenities[key as keyof typeof formValues.amenities]
              )}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Icon
                  color={formValues.amenities[key as keyof typeof formValues.amenities] ? 'secondary' : 'action'}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: formValues.amenities[key as keyof typeof formValues.amenities]
                    ? 'secondary.main'
                    : 'text.secondary',
                  fontWeight: 500,
                  }}
                >
                  {label}
              </Typography>
            </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>

    {/* Submit button */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button 
        variant="contained"
        color="gradient"
        size="large"
        onClick={handleCreateVenue}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
        sx={{
          minWidth: 200,
          height: '48px',
          borderRadius: 3,
        }}
      >
        {loading ? 'Creating...' : 'Create Venue'}
        </Button>
      </Box>
    </Paper>
  </Container>
  );
}

export default CreateVenueForm;