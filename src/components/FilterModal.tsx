import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Select, MenuItem, InputLabel, Button, FormControlLabel, Checkbox, Stack, Box } from '@mui/material';
import { FilterState, PRICE_OPTIONS, GUEST_OPTIONS, RATING_OPTIONS, AMENITIES } from '../types/filters';

interface FilterModalProps {
  open: boolean;
  filterState: FilterState;
  onClose: () => void;
  onApply: () => void;
  setFilterState: (filter: FilterState) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ open, filterState, onClose, onApply, setFilterState }) => {
  const handleChange = (field: keyof FilterState, value: string | boolean) => {
    setFilterState({
      ...filterState, 
      [field]: value, 
    });
  };

  const renderSelect = (
    label: string,
    field: keyof FilterState,
    options: { value: string, label: string }[]
  ) => (
    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        name={field}
        value={filterState[field]}
        onChange={(e) => handleChange(field, e.target.value)}
      >
        {options.map(({ value, label }) => (
          <MenuItem key={value} value={value}>{label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          m: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>Filter Venues</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {/* Selects */}
          {renderSelect('Price', 'price', PRICE_OPTIONS)}
          {renderSelect('Guests', 'guests', GUEST_OPTIONS)}
          {renderSelect('Rating', 'rating', RATING_OPTIONS)}

          {/* Amenities */}
          <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
            {AMENITIES.map(({ key, label }) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox 
                    checked={filterState[key as keyof FilterState] as boolean}
                    onChange={(e) => handleChange(key as keyof FilterState, e.target.checked)}
                  />
                }
                label={label}
              />
            ))}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ minWidth: 100 }}>Cancel</Button>
        <Button onClick={() => { onApply(); onClose(); }} variant="contained" sx={{ minWidth: 100 }}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterModal;