import api from '../services/api';
import { UserProfileResponse } from '../types/User';

export const getUserProfile = async (userName: string): Promise<UserProfileResponse> => {
  try {
    console.log('Fetching user profile for:', userName);
    const response = await api.get<UserProfileResponse>(`/holidaze/profiles/${userName}`);
    console.log('Fetched user profile:', response);
    return response.data; 
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};