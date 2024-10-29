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
    const response = await api.get<Venue[]>('/venues');
    return response.data;
};