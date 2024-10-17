import axios from './api';
import { Venue } from '../types/Venue';

export const getVenueById = async (id: string): Promise<Venue> => {
    const response = await axios.get<Venue>(`/venues/${id}`);
    return response.data;
};

export const getAllVenues = async (): Promise<Venue[]> => {
    const response = await axios.get<Venue[]>('/venues');
    return response.data;
};