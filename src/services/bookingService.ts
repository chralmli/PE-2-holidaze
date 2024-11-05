import api from '../services/api';
import { BookingRequest, BookingResponse } from '../types/Booking';

// Get bookings for a specific venue
export const getBookingsByVenueId = async (venueId: string, includeVenue: boolean = false, includeCustomer: boolean = false): Promise<BookingResponse[]> => {
    const queryParams = new URLSearchParams();
    if (includeVenue) queryParams.append('_venue', 'true');
    if (includeCustomer) queryParams.append('_customer', 'true');

    const response = await api.get<{ data: BookingResponse[] }>(`/venues/${venueId}/bookings?${queryParams.toString()}`);
    return response.data.data;
};

// Function to get bookings for a specific user
export const getBookingsByUserId = async (userId: string, includeVenue: boolean = false, includeCustomer: boolean = false): Promise<BookingResponse[]> => {
    const queryParams = new URLSearchParams();
    if (includeVenue) queryParams.append('_venue', 'true');
    if (includeCustomer) queryParams.append('_customer', 'true');

    const response = await api.get<{ data: BookingResponse[] }>(`/users/${userId}/bookings?${queryParams.toString()}`);
    return response.data.data;
};

// Function to create a booking for a specific venue
export const createBooking = async (venueId: string, bookingData: BookingRequest): Promise<BookingResponse> => {
    try {
        const response = await api.post<{data: BookingResponse }>(`/venues/${venueId}/bookings`, bookingData);
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to create booking');
    }
};