import { useState } from 'react';

const useBookingModal = () => {
    // State to manage bookings modal visibility and selected venue ID
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

    const openModal = (venueId: string) => {
      setSelectedVenueId(venueId);
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedVenueId(null);
    };

    return {
      isModalOpen,
      selectedVenueId,
      openModal,
      closeModal,
    };
  };

  export default useBookingModal;