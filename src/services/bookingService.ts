import api from './api';
import { Booking } from '../types/Booking';

export const getBookingsByVenueId = async (venueId: string): Promise<Booking[]> => {
    const response = await api.get<Booking[]>(`/venues/${venueId}/bookings`);''
    return response.data;
};

export const createBooking = async (venueId: string, bookingData: Partial<Booking>): Promise<Booking> => {
    const response = await api.post<Booking>(`/venues/${venueId}/bookings`, bookingData);
    return response.data;
};