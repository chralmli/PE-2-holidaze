import React, { useState } from 'react';
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress, 
  Switch, 
  FormControlLabel,
  Box,
  IconButton,
  Divider,
  Alert,
 } from '@mui/material';
 import { Close as CloseIcon } from '@mui/icons-material';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (updates: { bio: string; avatarUrl: string; bannerUrl: string; venueManager: boolean }) => void;
  updating: boolean;
  updateError: string | null;
  initialValues: { bio: string; avatarUrl: string; bannerUrl: string; venueManager: boolean };
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
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        }
      }}
    >
    <DialogTitle
      sx={{
        p: 3,
        m: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #34e89e 0%, #0f3443 100%)',
        color: 'white',
      }}
    >
      <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
        Edit Profile
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            color: 'white',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
    </DialogTitle>

    <DialogContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
        {/* Profile URL section */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 2,
              mb: 2,
              color: 'primary.main',
              fontWeight: 500,
            }}
          >
            Profile Images
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Avatar URL"
            value={formData.avatarUrl}
            onChange={handleChange('avatarUrl')}
            fullWidth
            variant="outlined"
            placeholder="Enter URL for your profile picture"
            inputProps={{
              sx: { borderRadius: 2 },
            }}
          />
          <TextField
            label="Banner URL"
            value={formData.bannerUrl}
            onChange={handleChange('bannerUrl')}
            fullWidth
            variant="outlined"
            placeholder="Enter URL for your profile banner"
            inputProps={{
              sx: { borderRadius: 2 },
            }}
          />
        </Box>
      </Box>

      <Divider />
      
      {/* Bio section */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            mt: 2,
            mb: 2,
            color: 'primary.main',
            fontWeight: 500,
          }}
        >
          About You
        </Typography>
        <TextField
          label="Bio"
          value={formData.bio}
          onChange={handleChange('bio')}
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          helperText={
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                color: bioError ? 'error.main' : 'text.secondary',
              }}
            >
              <span>{bioError}</span>
              <span>{`${formData.bio.length}/${BIO_CHAR_LIMIT}`}</span>
            </Box>
          }
          error={!!bioError}
          inputProps={{
            sx: { borderRadius: 2 },
          }}
        />
      </Box>

      <Divider />

      {/* Venue Manager section */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'grey.50'
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={formData.venueManager}
              disabled={formData.venueManager}
              onChange={(e) => setFormData({ ...formData, venueManager: e.target.checked })}
              color="primary"
            />
          }
          label={
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formData.venueManager
                ? 'You are a Venue Manager'
                : 'Apply to become a Venue Manager'}
            </Typography>
          }
        />
      </Box>

      {/* Error message */}
      {updateError && (
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: 'error.main'
            }
          }}
        >
          {updateError}
        </Alert>
      )}
    </Box>
  </DialogContent>

    <DialogActions
      sx={{
        p: 3,
        gap: 2,
        borderTop: '1px solid',
        borderColor: 'grey.100',
      }}
    >
      <Button 
        onClick={onClose}
        variant="outlined"
        sx={{
          borderRadius: 2,
          px: 3,
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        color="gradient"
        onClick={handleSubmit}
        disabled={updating || !!bioError}
        sx={{
          borderRadius: 2,
          px: 3,
          minWidth: 120,
        }}
      >
        {updating ? (
          <CircularProgress size={24} />
        ) : (
          'Save Changes'
        )}
      </Button>
    </DialogActions>
  </Dialog>
  );
};

export default EditProfileModal;
