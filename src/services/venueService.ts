import api from '../services/api';
import { Venue, VenueResponse } from '../types/Venue';

/**
 * Fetches a venue by its ID from the API.
 * @param {string} id - The ID of the venue to fetch
 * @return {Promise<Venue>} - A promise that resolves to the fetched venue.
 * @throws {Error} - Throws an error if there's a problem fetching the venue.
 */

export const getVenueById = async (id: string): Promise<Venue> => {
    try {
        const response = await api.get<{ data: Venue }>(`/holidaze/venues/${id}?_bookings=true&_owner=true`);

        if (!response.data || !response.data.data) {
            throw new Error('Invalid response format');
        }

        return response.data.data;
    } catch (error: any) {
        console.error('Error fetching venue:', error.response?.data || error.message);
        throw new Error('Error fetching venue');
    }
};


/**
 * Fetches all venues with pagination support
 * @param {number} page - The page number to fetch
 * @param {number} perPage - Number of venues per page
 * @param {Object} options - Additional fetch options
 * @param {boolean} options._owner - Include owner information
 * @param {boolean} options._bookings - Include booking information
 * @returns {Promise<VenueResponse>} Paginated venue data
 * @throws {Error} If venues cannot be fetched
 */

export const getAllVenues = async (page: number, perPage: number, options: { _owner?: boolean, _bookings?: boolean }): Promise<VenueResponse> => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('perPage', perPage.toString());

        if (options._owner) {
            queryParams.append('_owner', 'true');
        }
        if (options._bookings) {
            queryParams.append('_bookings', 'true');
        }

        const response = await api.get<VenueResponse>(`/holidaze/venues?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching venues:', error);
        throw new Error ('Error fetching venues')
    }
};

/**
 * Fetches all venues for a specific user
 * @param {string} userName - The username of the venue owner
 * @returns {Promise<Venue[]>} Array of venues owned by the user
 * @throws {Error} If venues cannot be fetched
 */

export const getVenuesByUserId = async (userName: string): Promise<Venue[]> => {
    try {
        const response = await api.get<{ data: Venue[] }>(`/holidaze/profiles/${userName}/venues?_bookings=true&_owner=true`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching venues by user:', error);
        throw new Error('Error fetching venues by user');
    }
};

/**
 * Creates a new venue
 * @param {Partial<Venue>} venueData - The venue data to create
 * @returns {Promise<Venue>} The created venue
 * @throws {Error} If venue creation fails
 */

export const createVenue = async (venueData: Partial<Venue>): Promise<Venue> => {
    try {
        const response = await api.post<{ data: Venue }>('/holidaze/venues', venueData);
        return response.data.data;
    } catch (error) {
        console.error('Error creating venue:', error);
        throw new Error('Error creating venue');
    }
};

/**
 * Updates an existing venue
 * @param {string} id - The ID of the venue to update
 * @param {Partial<Venue>} updatedData - The data to update
 * @returns {Promise<Venue>} The updated venue
 * @throws {Error} If venue update fails
 */

export const updateVenue = async (id: string, updatedData: Partial<Venue>): Promise<Venue> => {
    try {
        const response = await api.put<{ data: Venue }>(`/holidaze/venues/${id}`, updatedData);
        return response.data.data;
    } catch (error) {
        console.error('Error updating venue:', error);
        throw new Error('Error updating venue');
    }
};

/**
 * Deletes a venue
 * @param {string} venueId - The ID of the venue to delete
 * @returns {Promise<void>}
 * @throws {Error} If venue deletion fails
 */

export const deleteVenue = async (venueId: string): Promise<void> => {
    try {
        await api.delete(`/holidaze/venues/${venueId}`);
    } catch (error) {
        console.error('Error deleting venue:', error);
        throw error;
    }
};