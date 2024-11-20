import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel, Alert, Grid, Paper, Divider, FormGroup, InputAdornment, styled } from '@mui/material';
import {
  Wifi, LocalParking, FreeBreakfast, Pets, LocationOn, Image, Info, } from '@mui/icons-material';
import { createVenue } from '../services/venueService';

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}));

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

  const handleLocationChange = (field: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleMediaChange = (field: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      media: {
       ...prev.media,
        [field]: value,
      },
    }));
  };

  const handleAmenityChange = (field: string, value: boolean) => {
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
  <StyledPaper>
    <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
      Create a new venue
    </Typography>

    {message &&  (
      <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 3}}>
        {message.text}
      </Alert>
    )}

    <FormSection>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Info />
        Basic Information
      </Typography>
      <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Venue Name"
              value={formValues.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
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
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>
      </Grid>
    </FormSection>

    <Divider sx={{ my: 4 }} />

    <FormSection>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocationOn /> Location Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            value={formValues.location.address}
            onChange={(e) => handleLocationChange('location.address', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={formValues.location.city}
            onChange={(e) => handleLocationChange('location.city', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="ZIP"
            value={formValues.location.zip}
            onChange={(e) => handleLocationChange('location.zip', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            value={formValues.location.country}
            onChange={(e) => handleLocationChange('location.country', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Continent"
            value={formValues.location.continent}
            onChange={(e) => handleLocationChange('location.continent', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Latitude"
            type="number"
            value={formValues.location.latitude}
            onChange={(e) => handleLocationChange('location.latitude', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Longitude"
            type="number"
            value={formValues.location.longitude}
            onChange={(e) => handleLocationChange('location.longitude', e.target.value)}
          />
        </Grid>
      </Grid>
    </FormSection>

    <Divider sx={{ my: 4 }} />

    <FormSection>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Image /> Media
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Image URL"
            value={formValues.media.url}
            onChange={(e) => handleMediaChange('url', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Image Description"
            value={formValues.media.alt}
            onChange={(e) => handleMediaChange('alt', e.target.value)}
          />
        </Grid>
      </Grid>
    </FormSection>

    <Divider sx={{ my: 4 }} />

    <FormSection>
      <Typography variant="h6" gutterBottom>
        Amenities
      </Typography>
      <FormGroup row sx={{ gap: 3}}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formValues.amenities.wifi}
              onChange={(e) => handleAmenityChange('wifi', e.target.checked)}
              icon={<Wifi color="action" />}
              checkedIcon={<Wifi color="secondary" />}
            />
          }
          label="Wifi"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formValues.amenities.parking}
              onChange={(e) => handleAmenityChange('parking', e.target.checked)}
              icon={<LocalParking color="action" />}
              checkedIcon={<LocalParking color="secondary" />}
            />
          }
          label="Parking"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formValues.amenities.breakfast}
              onChange={(e) => handleAmenityChange('breakfast', e.target.checked)}
              icon={<FreeBreakfast color="action" />}
              checkedIcon={<FreeBreakfast color="secondary" />}
            />
          }
          label="Breakfast"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formValues.amenities.pets}
              onChange={(e) => handleAmenityChange('pets', e.target.checked)}
              icon={<Pets color="action" />}
              checkedIcon={<Pets color="secondary" />}
            />
          }
          label="Pets Allowed"
        />
      </FormGroup>
    </FormSection>

    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
      <Button 
        variant="contained"
        color="primary"
        size="large"
        onClick={handleCreateVenue}
        disabled={loading}
        sx={{
          minWidth: 200,
          background: 'linear-gradient(135deg, #34e89e, #0f3443)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0f3443, #34e89e)',
          },
        }}
      >
        {loading ? 'Creating...' : 'Create Venue'}
        </Button>
      </Box>
    </StyledPaper>
  );
}

export default CreateVenueForm;