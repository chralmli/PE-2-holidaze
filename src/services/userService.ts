import api from '../services/api';
import { UserProfileResponse } from '../types/User';

export const getUserProfile = async (userName: string): Promise<UserProfileResponse> => {
  try {
    const response = await api.get<UserProfileResponse>(`/holidaze/profiles/${userName}?_bookings=true&_venues=true`);
    console.log('Fetched user profile:', response);
    return response.data; 
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};

export const updateUserProfile = async (
  userName: string,
  updates: {
    bio?: string;
    avatarUrl?: string;
    bannerUrl?: string;
  }
): Promise<void> => {
  try {
    const payload = {
      bio: updates.bio,
      avatar: {
        url: updates.avatarUrl,
        alt: 'User avatar',
      },
      banner: {
        url: updates.bannerUrl,
        alt: 'User banner',
      },
    };

    await api.put(`/holidaze/profiles/${userName}`, payload);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};