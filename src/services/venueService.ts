import api from '../services/api';
import { Venue, VenueResponse } from '../types/Venue';

export const getVenueById = async (id: string): Promise<Venue> => {
    try {
        const response = await api.get<VenueResponse>(`/holidaze/venues/${id}?_bookings=true`);

        if (!response.data || !response.data.data) {
            throw new Error('Invalid response format');
        }

        return response.data.data;
    } catch (error: any) {
        console.error('Error fetching venue:', error.response?.data || error.message);
        throw new Error('Error fetching venue');
    }
};

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

export const getVenuesByUserId = async (userName: string): Promise<Venue[]> => {
    try {
        const response = await api.get<{ data: Venue[] }>(`/holidaze/profiles/${userName}/venues`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching venues by user:', error);
        throw new Error('Error fetching venues by user');
    }
};

export const createVenue = async (venueData: Partial<Venue>): Promise<Venue> => {
    try {
        const response = await api.post<VenueResponse>('/holidaze/venues', venueData);
        return response.data.data;
    } catch (error) {
        console.error('Error creating venue:', error);
        throw new Error('Error creating venue');
    }
};

export const updateVenue = async (id: string, updatedData: Partial<Venue>): Promise<Venue> => {
    try {
        const response = await api.put<VenueResponse>(`/holidaze/venues/${id}`, updatedData);
        return response.data.data;
    } catch (error) {
        console.error('Error updating venue:', error);
        throw new Error('Error updating venue');
    }
};

export const deleteVenue = async (venueId: string): Promise<void> => {
    try {
        await api.delete(`/holidaze/venues/${venueId}`);
    } catch (error) {
        console.error('Error deleting venue:', error);
        throw error;
    }
};