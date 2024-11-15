import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography, CircularProgress } from '@mui/material';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (updates: { bio: string; avatarUrl: string; bannerUrl: string; }) => void;
  updating: boolean;
  updateError: string | null;
  initialValues: { bio: string; avatarUrl: string; bannerUrl: string; };
};

const BIO_CHAR_LIMIT = 160;

const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, onClose, onUpdate, updating, updateError, initialValues }) => {
  const [formData, setFormData] = useState(initialValues);
  const [bioError, setBioError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    if (field === 'bio' && newValue.length > BIO_CHAR_LIMIT) {
      setBioError(`Bio cannot exceed ${BIO_CHAR_LIMIT} characters`);
    } else {
      setBioError(null);
    }

    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData.bio.length > BIO_CHAR_LIMIT) {
      setBioError('Bio cannot exceed ${BIO_CHAR_LIMIT} characters');
      return;
    }
    onUpdate(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>Edit Profile</DialogTitle>
    <DialogContent>
      <TextField
        label="Avatar URL"
        value={formData.avatarUrl}
        onChange={handleChange('avatarUrl')}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Banner URL"
        value={formData.bannerUrl}
        onChange={handleChange('bannerUrl')}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Bio"
        value={formData.bio}
        onChange={handleChange('bio')}
        multiline
        rows={4}
        fullWidth
        helperText={bioError || `${formData.bio.length}/${BIO_CHAR_LIMIT} characters`}
        error={!!bioError}
        sx={{ marginBottom: 2 }}
      />
      {updateError && (
        <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
          {updateError}
        </Typography>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="secondary">
        Cancel
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={updating || !!bioError}
      >
        {updating ? <CircularProgress size={24} /> : 'Save Changes'}
      </Button>
    </DialogActions>
  </Dialog>
  )
}

export default EditProfileModal;
