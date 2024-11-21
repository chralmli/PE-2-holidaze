import api from '../services/api';
import { BookingRequest, BookingResponse } from '../types/Booking';

/**
 * Updates an existing booking
 * @param {string} bookingId - The ID of the booking to update
 * @param {Partial<BookingRequest>} updatedData - The data to update
 * @returns {Promise<BookingResponse>} The updated booking
 * @throws {Error} If booking update fails
 */

export const updateBooking = async (bookingId: string, updatedData: Partial<BookingRequest>): Promise<BookingResponse> => {
    try {
        const response = await api.put<{ data: BookingResponse }>(`/holidaze/bookings/${bookingId}`, updatedData);
        return response.data.data;
    } catch (error: any) {
        console.error('Failed to update booking:', error.response?.data || error.message);
        throw new Error('Failed to update booking');
    }
};

/**
 * Deletes a booking
 * @param {string} bookingId - The ID of the booking to delete
 * @returns {Promise<void>}
 * @throws {Error} If booking deletion fails
 */

export const deleteBooking = async (bookingId: string): Promise<void> => {
    try {
        await api.delete(`/holidaze/bookings/${bookingId}`);
    } catch (error: any) {
        console.error('Failed to delete booking:', error.response?.data || error.message);
        throw new Error('Failed to delete booking');
    }
};

/**
 * Fetches all bookings for a specific user
 * @param {string} userName - The username to fetch bookings for
 * @returns {Promise<BookingResponse[]>} Array of user's bookings
 * @throws {Error} If bookings cannot be fetched
 */

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

/**
 * Creates a new booking for a venue
 * @param {BookingRequest} bookingData - The booking data
 * @param {string} bookingData.dateFrom - Start date of the booking (YYYY-MM-DD)
 * @param {string} bookingData.dateTo - End date of the booking (YYYY-MM-DD)
 * @param {number} bookingData.guests - Number of guests
 * @param {string} bookingData.venueId - ID of the venue to book
 * @returns {Promise<BookingResponse>} The created booking
 * @throws {Error} If booking creation fails or validation fails
 */

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