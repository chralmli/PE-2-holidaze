import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import { getVenueById, updateVenue, deleteVenue } from '../services/venueService';
import { Venue } from '../types/Venue';

const EditVenueForm: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchVenue = async () => {
      if (!venueId) return;

      try {
        const fetchedVenue = await getVenueById(venueId);
        setVenue(fetchedVenue);
      } catch (error) {
        console.error('Failed to fetch venue:', error);
        setMessage({ type: 'error', text: 'Failed to fetch venue' });
      } finally {
        setLoading(false);
      }
    };
  fetchVenue();
  }, [venueId]);

  const handleUpdateVenue = async () => {
    if (!venue || !venueId) {
      setMessage({ type: 'error', text: 'Unable to update venue. Missing venue or venue ID' });
      return;
    }

    try {
      await updateVenue(venueId, venue);
      setMessage({ type: 'success', text: 'Venue updated successfully' });
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error('Failed to update venue:', error);
      setMessage({ type: 'error', text: 'Failed to update venue. Please try again later' });
    }
  };

  const handleDeleteVenue = async () => {
    if (!venueId) {
      setMessage({ type: 'error', text: 'Unable to delete venue. Missing venue ID' });
      return;
    }

    const confirmation = window.confirm('Are you sure you want to delete this venue?');

    if (confirmation) {
      try {
        await deleteVenue(venueId);
        setMessage({ type:'success', text: 'Venue deleted successfully' });
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } catch (error) {
        console.error('Failed to delete venue:', error);
        setMessage({ type: 'error', text: 'Failed to delete venue. Please try again later' });
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!venue) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h4">Venue not found</Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
            maxWidth: '800px',
            margin: '40px auto',
            padding: '24px',
            borderRadius: '10px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ffffff',
          }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Edit Venue
      </Typography>

      {message && (
        <Typography
          variant="body1"
          color={message.type ==='success'? 'success.main' : 'error.main'}
          sx={{ mb: 2 }}
        >
          {message.text}
        </Typography>
      )}

      {/* Venue fields */}
      <TextField
        label="Venue Name"
        value={venue.name}
        onChange={(e) => setVenue({...venue, name: e.target.value })}
        fullWidth
        sx={{ mb: 2}}
      />
      <TextField
        label="Description"
        variant="outlined"
        multiline
        rows={4}
        value={venue.description}
        onChange={(e) => setVenue({...venue, description: e.target.value })}
        fullWidth
        sx={{ mb: 2}}
      />
      <TextField
        label="Price per Night"
        type="number"
        value={venue.price}
        onChange={(e) => setVenue({...venue, price: Number(e.target.value) })}
        fullWidth
        sx={{ mb: 2}}
      />
      <TextField
        label="Max guests"
        type="number"
        value={venue.maxGuests}
        onChange={(e) => setVenue({...venue, maxGuests: Number(e.target.value) })}
        fullWidth
        sx={{ mb: 2}}
      />

      {/* Amenities */}
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Amenities</Typography>
      <FormControlLabel
        control={<Checkbox checked={venue.meta.wifi} onChange={(e) => setVenue({...venue, meta: {...venue.meta, wifi: e.target.checked}})} />}
        label="Wifi"
      />
      <FormControlLabel
        control={<Checkbox checked={venue.meta.parking} onChange={(e) => setVenue({...venue, meta: {...venue.meta, parking: e.target.checked}})} />}
        label="Parking"
      />
      <FormControlLabel
        control={<Checkbox checked={venue.meta.breakfast} onChange={(e) => setVenue({...venue, meta: {...venue.meta, breakfast: e.target.checked}})} />}
        label="Breakfast"
      />
      <FormControlLabel
        control={<Checkbox checked={venue.meta.pets} onChange={(e) => setVenue({...venue, meta: {...venue.meta, pets: e.target.checked}})} />}
        label="Pets"
      />

      {/* Action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button 
          onClick={handleUpdateVenue}
          variant="contained" 
          color="primary"
          sx={{ flexGrow: 1, mr: 1 }}
        >
          Update Venue
        </Button>
        <Button 
            onClick={() => navigate(-1)}
            variant="contained" 
            color="secondary"
            sx={{ flexGrow: 1, mr: 1 }}
          >
            Cancel
        </Button>
        <Button 
            onClick={handleDeleteVenue}
            variant="contained" 
            color="error"
            sx={{ flexGrow: 1, mr: 1 }}
          >
            Delete Venue
        </Button>
      </Box>

      {/* Map */}
      {/* Implement map functionality here */}

      {/* Additional fields */}
      {/* Implement additional fields as needed */}


    </Box>
  );
};

export default EditVenueForm;