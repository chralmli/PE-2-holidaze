import api from '../services/api';
import { UserProfileResponse } from '../types/User';

/**
 * Fetches a user's profile including their bookings and venues
 * @param {string} userName - The username of the profile to fetch
 * @returns {Promise<UserProfileResponse>} The user's profile data
 * @throws {Error} If the profile cannot be fetched
 */
export const getUserProfile = async (userName: string): Promise<UserProfileResponse> => {
  try {
    const response = await api.get<UserProfileResponse>(`/holidaze/profiles/${userName}?_bookings=true&_venues=true`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};

/**
 * Updates a user's profile information
 * @param {string} userName - The username of the profile to update
 * @param {Object} updates - The profile updates
 * @param {string} [updates.bio] - User's biography
 * @param {string} [updates.avatarUrl] - URL for user's avatar image
 * @param {string} [updates.bannerUrl] - URL for user's banner image
 * @returns {Promise<void>}
 * @throws {Error} If the profile update fails
 * 
 * @example
 * ```typescript
 * await updateUserProfile('username', {
 *   bio: 'New bio',
 *   avatarUrl: 'https://example.com/avatar.jpg',
 *   bannerUrl: 'https://example.com/banner.jpg'
 * });
 * ```
 */
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