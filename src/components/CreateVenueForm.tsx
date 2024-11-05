import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { createVenue } from '../services/venueService';

const CreateVenueForm: React.FC = () => {
  const [venueName, setVenueName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [maxGuests, setMaxGuests] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateVenue = async () => {
    try {
      const venueData = {
        name: venueName,
        description,
        price,
        maxGuests,
      };
      await createVenue(venueData);
      setMessage('Venue created successfully!');
    } catch (error) {
      console.error('Error creating venue:', error);
      setMessage('Failed to create venue. Please try again later.');
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
    {message && <Typography color="primary">{message}</Typography>}
    <TextField
      label="Venue Name"
      variant='outlined'
      value={venueName}
      onChange={(e) => setVenueName(e.target.value)}
    />
    <TextField
      label="Description"
      variant='outlined'
      multiline
      rows={4}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />
    <TextField
      label="Price per night"
      type="number"
      variant='outlined'
      value={price}
      onChange={(e) => setPrice(Number(e.target.value))}
    />
    <TextField
      label="Max guests"
      type="number"
      variant='outlined'
      value={maxGuests}
      onChange={(e) => setMaxGuests(Number(e.target.value))}
    />
    <Button onClick={handleCreateVenue} variant="contained" color="primary">
      Create Venue
    </Button>
  </Box>
  );
};

export default CreateVenueForm;