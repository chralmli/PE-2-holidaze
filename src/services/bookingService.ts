import api from '../services/api';
import { BookingRequest, BookingResponse } from '../types/Booking';

// Function to update a booking
export const updateBooking = async (bookingId: string, updatedData: Partial<BookingRequest>): Promise<BookingResponse> => {
    try {
        const response = await api.put<{ data: BookingResponse }>(`/holidaze/bookings/${bookingId}`, updatedData);
        return response.data.data;
    } catch (error: any) {
        console.error('Failed to update booking:', error.response?.data || error.message);
        throw new Error('Failed to update booking');
    }
};

// Function to delete a booking
export const deleteBooking = async (bookingId: string): Promise<void> => {
    try {
        await api.delete(`/holidaze/bookings/${bookingId}`);
    } catch (error: any) {
        console.error('Failed to delete booking:', error.response?.data || error.message);
        throw new Error('Failed to delete booking');
    }
};

// Get bookings for a specific venue
export const getBookingsByVenueId = async (venueId: string,): Promise<BookingResponse[]> => {
    try {
        console.log(`Fetching bookings for venue: ${venueId}`);
        const response = await api.get<{ data: BookingResponse[] }>(`/holidaze/bookings?venueId=${venueId}&limit=100`);

        const bookings = response.data.data;

        console.log(`Bookings fetched:`, bookings);

        // Filter and validate bookings
        const validBookings = bookings.filter((booking) => {
            const dateFrom = new Date(booking.dateFrom);
            const dateTo = new Date(booking.dateTo);
            
            if (dateTo < dateFrom) {
                console.error('Invalid booking dates:', booking);
                return false;
            }

            if(isNaN(dateFrom.getTime()) || isNaN(dateTo.getTime())) {
                console.error('Invalid date format:', booking);
                return false;
            }

            return true;
        })

        console.log(`Valid bookings after filtering`, validBookings);

        return validBookings;

    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            console.warn('No bookings found for this venue');
            return [];
        } else {
            console.error('Error fetching bookings:', error);
            throw new Error('Error fetching bookings');
        }
    }
};

// Function to get bookings for a specific user
export const getBookingsByUserName = async (userName: string): Promise<BookingResponse[]> => {
    try {
        const response = await api.get<{ data: BookingResponse[] }>(`/holidaze/profiles/${userName}/bookings`);
        return response.data.data;
    } catch (error: any) {
        if (error.response && error.response.status == 404) {
            console.warn('No bookings found for this user');
            return [];
        } else {
            console.error('Error fetching bookings:', error);
            throw new Error('Error fetching bookings');
        }
    }
};

// Function to create a booking for a specific venue
export const createBooking = async (bookingData: BookingRequest): Promise<BookingResponse> => {
    // Validate the bookingData before making the request
    const { dateFrom, dateTo, guests } = bookingData;

    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    // ensure that dateFrom is before dateTo
    if (to < from) {
        throw new Error('The end date must be after the start date');
    }

    // ensure guests are greater than 0
    if (guests <= 0) {
        throw new Error('Number of guests must be greater than 0');
    }
    try {
        const response = await api.post<{data: BookingResponse }>(`/holidaze/bookings`, bookingData);
        return response.data.data;
    } catch (error: any) {
        console.error('Failed to create booking', error.response?.data || error.message);
        throw new Error('Failed to create booking');
    }
};