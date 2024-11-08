import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel, Alert } from '@mui/material';
import { createVenue } from '../services/venueService';

const CreateVenueForm: React.FC = () => {
  const [venueName, setVenueName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [maxGuests, setMaxGuests] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Location details
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [continent, setContinent] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');

  // Media (URL of images)
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaAlt, setMediaAlt] = useState('');

  // Amenities
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);

  const handleCreateVenue = async () => {
    if (!venueName || !description || !price || !maxGuests) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields (venue name, description, price, max guests)',
      });
      return;
    }

    try {
      const venueData = {
        name: venueName,
        description,
        price: Number(price),
        maxGuests: Number(maxGuests),
        media: [
          {
            url: mediaUrl,
            alt: mediaAlt,
          },
        ],
        meta: {
          wifi,
          parking,
          breakfast,
          pets,
        },
        location: {
          address,
          city,
          zip,
          country,
          continent,
          lat: latitude ? Number(latitude) : 0,
          lng: longitude ? Number(longitude) : 0,
        },
      };
      await createVenue(venueData);
      setMessage({ type: 'success', text: 'Venue created successfully!' });

      // Clear form after successful creation
      setVenueName('');
      setDescription('');
      setPrice('');
      setMaxGuests('');
      setAddress('');
      setCity('');
      setZip('');
      setCountry('');
      setContinent('');
      setLatitude('');
      setLongitude('');
      setMediaUrl('');
      setMediaAlt('');
      setWifi(false);
      setParking(false);
      setBreakfast(false);
      setPets(false);
    } catch (error) {
      console.error('Error creating venue:', error);
      setMessage({ type: 'error', text: 'Failed to create venue. Please try again later.' });
    }
  };

return (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '20px',
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
    }}
  >
    <Typography variant="h5">Create a new venue</Typography>

    {message && (
      <Alert severity={message.type} onClose={() => setMessage(null)}>
        {message.text}
      </Alert>
    )}

    {/* Basic venue details */}
    <TextField
      label="Venue Name"
      variant='outlined'
      value={venueName}
      onChange={(e) => setVenueName(e.target.value)}
      required
    />
    <TextField
      label="Description"
      variant='outlined'
      multiline
      rows={4}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      required
    />
    <TextField
      label="Price per night"
      type="number"
      variant='outlined'
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      required
      InputProps={{ inputProps: { min: 0 } }}
    />
    <TextField
      label="Max guests"
      type="number"
      variant='outlined'
      value={maxGuests}
      onChange={(e) => setMaxGuests(e.target.value)}
      required
      InputProps={{ inputProps: { min: 1 } }}
    />

    {/* Location details */}
    <Typography variant="h6">Location</Typography>
    <TextField
      label="Address"
      variant='outlined'
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />
    <TextField
      label="City"
      variant='outlined'
      value={city}
      onChange={(e) => setCity(e.target.value)}
    />
    <TextField
      label="Zip"
      variant='outlined'
      value={zip}
      onChange={(e) => setZip(e.target.value)}
    />
    <TextField
      label="Country"
      variant='outlined'
      value={country}
      onChange={(e) => setCountry(e.target.value)}
    />
    <TextField
      label="Continent"
      variant='outlined'
      value={continent}
      onChange={(e) => setContinent(e.target.value)}
    />
    <TextField
      label="Latitude"
      type="number"
      variant='outlined'
      value={latitude}
      onChange={(e) => setLatitude(e.target.value)}
    />
    <TextField
      label="Longitude"
      type="number"
      variant='outlined'
      value={longitude}
      onChange={(e) => setLongitude(e.target.value)}
    />

    {/* Media (URL of images) */}
    <Typography variant="h6">Media</Typography>
    <TextField
      label="Media URL"
      variant='outlined'
      value={mediaUrl}
      onChange={(e) => setMediaUrl(e.target.value)}
      />
      <TextField
      label="Media Alt Text (optional)"
      variant='outlined'
      value={mediaAlt}
      onChange={(e) => setMediaAlt(e.target.value)}
    />

    {/* Amenities */}
    <Typography variant="h6">Amenities</Typography>
    <FormControlLabel
      control={<Checkbox checked={wifi} onChange={(e) => setWifi(e.target.checked)} />}
      label="Wifi"
    />
    <FormControlLabel
      control={<Checkbox checked={parking} onChange={(e) => setParking(e.target.checked)} />}
      label="Parking"
    />
    <FormControlLabel
      control={<Checkbox checked={breakfast} onChange={(e) => setBreakfast(e.target.checked)} />}
      label="Breakfast"
    />
    <FormControlLabel
      control={<Checkbox checked={pets} onChange={(e) => setPets(e.target.checked)} />}
      label="Pets Allowed"
    />


    <Button onClick={handleCreateVenue} variant="contained" color="primary">
      Create Venue
    </Button>
  </Box>
  );
};

export default CreateVenueForm;