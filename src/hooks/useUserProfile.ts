import { useEffect, useState } from 'react';
import { UserProfileResponse } from '../types/User';
import { getUserProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';

interface UseUserProfileResult {
  profile: UserProfileResponse['data'] | null;
  loading: boolean;
  error: string | null;
}

const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileResponse['data'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        console.warn('No user is currently logged in');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await getUserProfile(user.name);
        setProfile(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  return { profile, loading, error };
};

export default useUserProfile;