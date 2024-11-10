import { deleteVenue } from './venueService';

export const handleDeleteVenue = async (venueId: string, onSuccess?: () => void) => {
  if (window.confirm('Are you sure you want to delete this venue?')) {
    try {
      await deleteVenue(venueId);
      onSuccess && onSuccess();
    } catch (error) {
      console.error('Error deleting venue:', error);
    }
  }
};