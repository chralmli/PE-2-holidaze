import api from '../services/api';
import { Venue } from '../types/Venue';
import { VenueResponse } from '../types/Venue';

export const getVenueById = async (id: string): Promise<Venue> => {
    try {
        const response = await api.get<VenueResponse>(`/holidaze/venues/${id}`);
        return response.data.data;
    } catch (error) {
        throw new Error('Error fetching venue');
    }
};

export const getAllVenues = async (): Promise<Venue[]> => {
    try {
        const response = await api.get<{ data: Venue[] }>('/holidaze/venues');
        return response.data.data;
    } catch (error) {
        throw new Error ('Error fetching venues')
    }
};

export const getVenuesByUserId = async (userId: string): Promise<Venue[]> => {
    try {
        const response = await api.get<{ data: Venue[] }>(`/holidaze/venues?owner=${userId}`);
        return response.data.data;
    } catch (error) {
        throw new Error('Error fetching venues by user');
    }
};

export const createVenue = async (venueData: Partial<Venue>): Promise<Venue> => {
    try {
        const response = await api.post<VenueResponse>('/holidaze/venues', venueData);
        return response.data.data;
    } catch (error) {
        throw new Error('Error creating venue');
    }
};

export const deleteVenue = async (id: string): Promise<void> => {
    try {
        await api.delete(`/holidaze/venues/${id}`);
    } catch (error) {
        throw new Error('Error deleting venue');
    }
};