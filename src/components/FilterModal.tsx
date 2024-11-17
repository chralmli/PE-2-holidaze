import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Select, MenuItem, InputLabel, Button, FormControlLabel, Checkbox } from '@mui/material';

interface FilterModalProps {
  open: boolean;
  filterState: any;
  onClose: () => void;
  onApply: () => void;
  setFilterState: (filter: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ open, filterState, onClose, onApply, setFilterState }) => {
  const handleApply = () => {
    onApply();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Filter Venues</DialogTitle>
      <DialogContent>
        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
          <InputLabel>Price</InputLabel>
          <Select label="Price" name="price" value={filterState.price} onChange={(e) => setFilterState((prev: any) => ({ ...prev, price: e.target.value }))}>
            <MenuItem value="any">Any</MenuItem>
            <MenuItem value="100">100 NOK</MenuItem>
            <MenuItem value="200">200 NOK</MenuItem>
            <MenuItem value="300">300 NOK</MenuItem>
            <MenuItem value="400">400 NOK</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
          <InputLabel>Guests</InputLabel>
          <Select 
            label="Guests"
            name="guests"
            value={filterState.guests}
            onChange={(e) => setFilterState((prev: any) => ({ ...prev, guests: e.target.value }))}
          >
            <MenuItem value="any">Any</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="6">6</MenuItem>
            <MenuItem value="8">8</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
          <InputLabel>Rating</InputLabel>
          <Select 
            label="Rating"
            name="rating"
            value={filterState.rating}
            onChange={(e) => setFilterState((prev: any) => ({ ...prev, rating: e.target.value }))}
          >
            <MenuItem value="any">Any</MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="5">5</MenuItem>
          </Select>
        </FormControl>

        {/* Meta options */}
        <FormControlLabel
          control={<Checkbox checked={filterState.wifi} onChange={(e) => setFilterState((prev: any) => ({ ...prev, wifi: e.target.checked }))} />}
          label="Wifi"
        />
        <FormControlLabel
          control={<Checkbox checked={filterState.parking} onChange={(e) => setFilterState((prev: any) => ({ ...prev, parking: e.target.checked }))} />}
          label="Parking"
        />
        <FormControlLabel
          control={<Checkbox checked={filterState.breakfast} onChange={(e) => setFilterState((prev: any) => ({ ...prev, breakfast: e.target.checked }))} />}
          label="Breakfast"
        />
        <FormControlLabel
          control={<Checkbox checked={filterState.pets} onChange={(e) => setFilterState((prev: any) => ({ ...prev, pets: e.target.checked }))} />}
          label="Pets"
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleApply} color="primary">Apply</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterModal;